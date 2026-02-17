# EmailJS Debugging Guide - Complete Checklist

## Problem
EmailJS shows "Message sent successfully" but emails don't arrive in Gmail inbox.

---

## STEP 1: Check EmailJS Email History (Critical First Step)

**Action:**
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com) → **Email History** (left sidebar)
2. Look for your recent test sends
3. Check the **Status** column:
   - ✅ **Sent** = Email left EmailJS successfully
   - ❌ **Failed** = EmailJS blocked it (see error message)
   - ⚠️ **Pending** = Still processing

**What to look for:**
- If status is **Failed**, read the error message carefully
- If status is **Sent**, problem is likely Gmail side (spam/security)
- If **no entries exist**, your form isn't actually sending

---

## STEP 2: Verify Form Data is Sending (Browser Console Check)

**Action:**
1. Open your portfolio on localhost: `http://localhost:5173` (or your Vite port)
2. Press `F12` → **Console** tab
3. Fill the contact form and submit
4. Look for console messages

**Add logging to your Contact.jsx to verify:**

```jsx
const sendEmail = (e) => {
  e.preventDefault();
  
  // LOG FORM DATA BEFORE SENDING
  console.log("Form data being sent:", {
    user_name: form.current?.user_name?.value,
    user_email: form.current?.user_email?.value,
    subject: form.current?.subject?.value,
    message: form.current?.message?.value,
  });

  emailjs
    .sendForm(
      "service_u7ldm4a",
      "template_zvdfaa4",
      form.current,
      "fHZvZZA_VWAKE_QAq"
    )
    .then(
      (response) => {
        console.log("✅ EmailJS SUCCESS Response:", response);
        setIsSent(true);
        form.current.reset();
        toast.success("Message sent successfully! ✅", {
          position: "top-right",
          autoClose: 3000,
        });
      },
      (error) => {
        console.error("❌ EmailJS ERROR:", error);
        console.error("Error text:", error.text);
        console.error("Error status:", error.status);
        toast.error("Failed to send message. Check console for details.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    );
};
```

**Check console for:**
- Form data logged correctly with all 4 fields?
- EmailJS success or error response?
- Error message details?

---

## STEP 3: Check Network Request (Browser DevTools)

**Action:**
1. Press `F12` → **Network** tab
2. Submit the form
3. Look for request to `api.emailjs.com`

**What to check:**
- **Status code should be 200** (success)
- If **401** or **403** = Authentication issue (wrong Public Key)
- If **400** = Bad request (wrong field names/Service ID/Template ID)
- If **429** = Rate limited (too many requests)
- If **CORS error** = Domain not whitelisted

**Response should show:**
```json
{
  "status": 200,
  "text": "OK"
}
```

---

## STEP 4: Verify Domain Whitelisting (Most Common Issue!)

**For Localhost:**
1. Go to EmailJS → **Account** → **Security** → **Authorized domains**
2. Add: `http://localhost:5173` (or your dev port)
3. Add: `http://localhost:*` (wildcard for any port)

**For Vercel (Production):**
1. Go to EmailJS → **Account** → **Security** → **Authorized domains**
2. Add your Vercel domain: `https://your-portfolio.vercel.app`
3. Add wildcard: `https://*.vercel.app`

**If domains aren't whitelisted:**
- EmailJS will reject the request with error
- You'll see **401 Unauthorized** in Network tab

---

## STEP 5: Check Template Configuration

**Action:**
1. EmailJS Dashboard → **Email Templates**
2. Click `template_zvdfaa4`
3. Verify **Settings** tab:

| Field | Should Be |
|-------|----------|
| **Service** | Gmail (service_rcp2ymb or similar) |
| **To Email** | `chaturvediprateek474@gmail.com` |
| **From Email** | Use Default ✓ |
| **From Name** | `{{user_name}}` |
| **Reply To** | `{{user_email}}` |

**Content tab should have:**
- Subject: `Contact Us: {{subject}}`
- Body: Uses `{{user_name}}`, `{{user_email}}`, `{{message}}`

---

## STEP 6: Gmail Security & Spam Check

**Even if EmailJS succeeds, Gmail might block it:**

### Action 1: Check Gmail Spam Folder
- Go to Gmail → **Spam** folder
- Is your test email there? 
- If YES: Mark as "Not Spam" and whitelist sender

### Action 2: Enable "Less Secure App Access"
1. Go to [Gmail Security Settings](https://myaccount.google.com/security)
2. Scroll to **"How you sign in to Google"** → **App passwords** 
3. Create an "App Password" for EmailJS
4. Or enable **"Less secure app access"** (not recommended)

### Action 3: Check Gmail Forwarding Rules
1. Gmail → **Settings** → **Forwarding and POP/IMAP**
2. Make sure emails aren't being auto-forwarded elsewhere
3. Check **Filters and Blocked Addresses** for accidental blocks

---

## STEP 7: Test with EmailJS "Test It" Button

**Action:**
1. Go to EmailJS → **Email Templates** → `template_zvdfaa4`
2. Click **"Test It"** button
3. Check Email History to see if it was **Sent**
4. Check Gmail inbox/spam

**If Test Email Arrives:**
- Template configuration is correct
- Gmail connection works
- Problem is with your form/frontend code

**If Test Email Doesn't Arrive:**
- Problem is with service setup
- Check Email History for error details

---

## STEP 8: Verify Service Configuration

**Action:**
1. EmailJS Dashboard → **Email Services**
2. Find **Gmail** service (should be named "Gmail" or "service_rcp2ymb")
3. Click and verify:
   - Status: ✅ **Connected**
   - Gmail account: `chaturvediprateek474@gmail.com`
   - Service ID visible

**If not connected:**
- Click "Add New Service" → Gmail
- Re-authorize with your Gmail account

---

## STEP 9: Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| **401 Unauthorized** | Domain not whitelisted | Add domain to Email Services Security |
| **400 Bad Request** | Wrong field names in form | Verify form has `name="user_name"`, `name="user_email"`, etc. |
| **Template variable undefined** | Form field name doesn't match template | Template uses `{{user_name}}` but form sends `name` |
| **Rate Limited (429)** | Too many requests | Wait a few minutes before retrying |
| **CORS Error** | Backend/frontend mismatch | Add domain to authorized domains |
| **Email delivered to spam** | Gmail thinks it's spam | Whitelist sender in Gmail |

---

## STEP 10: Localhost vs Vercel Considerations

### For Localhost Testing:
```javascript
// Add environment check
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "fHZvZZA_VWAKE_QAq";

emailjs.init(PUBLIC_KEY); // Add this at top of Contact.jsx
```

### For Vercel Production:
1. Add environment variable in Vercel Dashboard:
   - Key: `REACT_APP_EMAILJS_PUBLIC_KEY`
   - Value: `fHZvZZA_VWAKE_QAq`

2. Add domain to EmailJS:
   - `https://your-portfolio.vercel.app`

3. Redeploy after adding domain

---

## STEP 11: Debug Response Handler

**Update your error handler to log everything:**

```jsx
.then(
  (response) => {
    console.log("✅ SUCCESS");
    console.log("Status:", response.status);
    console.log("Text:", response.text);
    // Status 200 = sent successfully
  },
  (error) => {
    console.error("❌ FAILED");
    console.error("Status:", error.status); // Check this!
    console.error("Text:", error.text); // Helpful error message
    console.error("Full error:", error);
    // Common statuses:
    // 401 = Domain/auth issue
    // 400 = Template/field name mismatch
    // 429 = Rate limited
  }
)
```

---

## STEP 12: Production Testing Checklist

Before deploying to Vercel:

- [ ] Form fields have correct `name` attributes
- [ ] Template variables match form field names
- [ ] Added `http://localhost:*` to authorized domains
- [ ] Test locally shows success in console
- [ ] Check Email History shows "Sent"
- [ ] Receive test email in Gmail inbox

Before going live:
- [ ] Added `https://your-domain.vercel.app` to authorized domains
- [ ] Deployed to Vercel
- [ ] Test form on live site
- [ ] Check Email History for success
- [ ] Email arrives in inbox

---

## Quick Debug Flow

```
1. Fill & submit form on localhost
   ↓
2. Check Browser Console → Do you see success message?
   ├─ NO → Check Network tab for error
   └─ YES → Go to step 3
   ↓
3. Check EmailJS Email History → Status is "Sent"?
   ├─ NO → Check error message in history
   └─ YES → Go to step 4
   ↓
4. Check Gmail Inbox + Spam
   ├─ Email found → Problem solved!
   └─ Not found → Check Gmail security settings
```

---

## Commands to Run

**Check if your Contact.jsx has the right service ID:**
```bash
grep -r "service_u7ldm4a" src/
```

**Verify public key:**
```bash
grep -r "fHZvZZA_VWAKE_QAq" src/
```

---

## Resources

- [EmailJS Dashboard](https://dashboard.emailjs.com)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Gmail Security Settings](https://myaccount.google.com/security)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)

---

## Next Steps

**Run through this checklist and tell me:**
1. What status appears in Email History?
2. What error appears in Browser Console?
3. What error appears in Network tab?
4. Is your domain whitelisted?
5. Did "Test It" button send successfully?

This will pinpoint the exact issue! 🚀
