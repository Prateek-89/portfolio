import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    // DEBUG: Log form data before sending
    const formData = {
      user_name: form.current?.user_name?.value,
      user_email: form.current?.user_email?.value,
      subject: form.current?.subject?.value,
      message: form.current?.message?.value,
    };
    console.log("📧 EmailJS - Form data being sent:", formData);
    console.log("📧 EmailJS - Service ID: service_u7ldm4a");
    console.log("📧 EmailJS - Template ID: template_zvdfaa4");

    emailjs
      .sendForm(
        "service_u7ldm4a",  // Your EmailJS Service ID
        "template_zvdfaa4",  // Your EmailJS Template ID
        form.current,
        "fHZvZZA_VWAKE_QAq"  // Your EmailJS Public Key
      )
      .then(
        (response) => {
          console.log("✅ EmailJS SUCCESS - Response:", response);
          console.log("✅ Status:", response.status);
          console.log("✅ Text:", response.text);
          console.log("✅ Check Email History at: https://dashboard.emailjs.com/admin/account");
          
          setIsSent(true);
          form.current.reset(); // Reset form fields after sending
          toast.success("Message sent successfully! ✅\nCheck your inbox in a few moments.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
        },
        (error) => {
          console.error("❌ EmailJS FAILED - Full Error:", error);
          console.error("❌ Status Code:", error.status);
          console.error("❌ Error Text:", error.text);
          
          // Provide specific error guidance
          let errorMessage = "Failed to send message. Please try again.";
          if (error.status === 401) {
            errorMessage = "❌ Authorization failed. Check Public Key or domain whitelist.";
          } else if (error.status === 400) {
            errorMessage = "❌ Bad request. Check form field names match template.";
          } else if (error.status === 429) {
            errorMessage = "❌ Rate limited. Wait a few moments and try again.";
          }
          
          console.error("❌ Suggested fix:", errorMessage);
          console.log("🔗 Debug guide: See EMAILJS_DEBUGGING_GUIDE.md in project root");
          
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
        }
      );
  };

  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center py-24 px-[12vw] md:px-[7vw] lg:px-[20vw]"
    >
      {/* Toast Container */}
      <ToastContainer />

      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">CONTACT</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          I’d love to hear from you—reach out for any opportunities or questions!
        </p>
      </div>

      {/* Contact Form */}
      <div className="mt-8 w-full max-w-md bg-[#0d081f] p-6 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-white text-center">
          Connect With Me <span className="ml-1">🚀</span>
        </h3>

        <form ref={form} onSubmit={sendEmail} className="mt-4 flex flex-col space-y-4">
          <input
            type="email"
            name="user_email"
            placeholder="Your Email"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            name="user_name"
            placeholder="Your Name"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows="4"
            required
            className="w-full p-3 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          
          {/* Send Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-white font-semibold rounded-md hover:opacity-90 transition"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
