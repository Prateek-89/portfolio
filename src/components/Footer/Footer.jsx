import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  // Smooth scroll function
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="text-white py-8 px-[12vw] md:px-[7vw] lg:px-[20vw]">
      <div className="container mx-auto text-center">
        {/* Name / Logo */}
        <h2 className="text-xl font-semibold text-purple-500">PRATEEK KUMAR</h2>

        {/* Navigation Links - Responsive */}
        <nav className="flex flex-wrap justify-center space-x-4 sm:space-x-6 mt-4">
          {[
            { name: "About", id: "about" },
            { name: "Skills", id: "skills" },
            { name: "Experience", id: "experience" },
            { name: "Projects", id: "projects" },
            { name: "Education", id: "education" },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => handleScroll(item.id)}
              className="hover:text-purple-500 text-sm sm:text-base my-1"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Social Media Icons - Responsive */}
        <div className="flex flex-wrap justify-center space-x-4 mt-6">
          {[
            { icon: <FaFacebook />, link: null, reactive: false },
            { icon: <FaTwitter />, link: null, reactive: false },
            { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/prateek-kumar-484b9121b/", reactive: true },
            { icon: <FaInstagram />, link: "https://www.instagram.com/prateek.chaturvedi.522/", reactive: true },
            { icon: <FaYoutube />, link: null, reactive: false },
            
          ].map((item, index) => (
            item.reactive ? (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl hover:text-purple-500 transition-transform transform hover:scale-110"
              >
                {item.icon}
              </a>
            ) : (
              <div key={index} className="text-xl text-gray-300">
                {item.icon}
              </div>
            )
          ))}
        </div>

        {/* Copyright Text */}
        <p className="text-sm text-gray-400 mt-6">
          © 2025 Prateek Kumar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
