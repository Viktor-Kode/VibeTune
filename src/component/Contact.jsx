import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_renapht',
        'template_2bkamta',
        form.current,
        'SS2R3dMbKoMDjBayk'
      )
      .then(
        () => {
          setSent(true);
        },
        (error) => {
          console.error('EmailJS Error:', error);
        }
      );
  };

  return (
    <section id="contact" className="bg-gray-200 text-white py-16 px-6 md:px-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-sky-400">Get in Touch</h2>
        <p className="text-lg text-gray-300 mb-10">
          Whether you're an artist, listener, or partner—VibeTune would love to hear from you.
        </p>

        <form ref={form} onSubmit={sendEmail} className="space-y-6 text-left">
          <div>
            <label className="block mb-2 text-sm font-medium text-black">Name</label>
            <input
              type="text"
              name="user_name"
              required
              className="w-full px-4 py-3 rounded-lg bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-black">Email</label>
            <input
              type="email"
              name="user_email"
              required
              className="w-full px-4 py-3 rounded-lg bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-black">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full px-4 py-3 rounded-lg bg-white text-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="Tell us what’s on your mind..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-400 text-white py-3 rounded-xl hover:bg-sky-500 transition"
          >
            Send Message
          </button>

          {sent && (
            <p className="mt-4 text-green-400 text-center">
              ✅ Message sent successfully!
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;