import React from 'react';

// PDF link
const pdfLink = "/Vauju_PenTest_Report_LilMafia.pdf";

function Bug() {
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <header className="bg-gray-50 p-6 border-b border-gray-200 text-center">
          <h1 className="text-3xl font-extrabold text-red-600 mb-2">Thank You, Lil Mafia! 🙏</h1>
          <p className="text-gray-600 text-lg md:text-xl">
            We appreciate your security assessment of the Vauju platform.
          </p>
        </header>

        {/* Body */}
        <section className="p-6 space-y-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            Your ethical hacking efforts help us improve and secure our platform for all users. 
            💖 We are committed to reviewing the report and taking immediate action to address the findings.
          </p>

          {/* PDF Attachment */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center space-x-4">
              <svg className="w-10 h-10 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM15 3.5V7h3.5L15 3.5z"/>
              </svg>
              <div>
                <p className="font-medium text-gray-800">Vauju_Security_Report.pdf</p>
                <a
                  href={pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline text-sm"
                >
                  View / Download PDF
                </a>
              </div>
            </div>
            <span className="text-gray-400 text-sm">📄</span>
          </div>

          <p className="text-gray-500 text-sm mt-2 text-center">
            Thank you for helping us keep Vauju secure. Your contribution is invaluable! 🚀
          </p>
        </section>
      </div>
    </main>
  );
}

export default Bug;
