
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">Blog</h1>
          
          <div className="mb-8">
            <p className="text-lg">
              Stay updated with the latest news, stories, and announcements from the CPSCS Alumni Association.
            </p>
          </div>
          
          {/* Placeholder blog posts - to be replaced with actual content */}
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2, 3, 4].map((post) => (
              <div key={post} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Blog Post Title {post}</h3>
                  <p className="text-gray-500 mb-4">August 15, 2023 • 5 min read</p>
                  <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.</p>
                  <button className="text-cpscs-blue font-medium hover:underline">Read more →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
