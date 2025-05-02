
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Blog posts data with real images
const blogPosts = [
  {
    id: 1,
    title: "Annual Reunion 2024: A Night to Remember",
    date: "January 15, 2025",
    readTime: "5 min read",
    excerpt: "Our annual reunion brought together over 300 alumni from across the generations, creating unforgettable memories and strengthening our community bonds.",
    image: "https://lh3.googleusercontent.com/pw/AP1GczPo97OKC-fKffD8mFdfJja5YWGcOg5ocXVPvyWPUFvGqDXv_-i6iCoWpmPbXFOQCk7pnvFDyjzB87fM75mCVzWTH_LBcH8aZE9qPIjQrNq5hj38pOlb8Q=w2400"
  },
  {
    id: 2,
    title: "Scholarship Program Helps 50 Students This Year",
    date: "February 20, 2025",
    readTime: "3 min read",
    excerpt: "Thanks to our generous alumni donors, our scholarship program has supported 50 bright students from CPSCS this academic year.",
    image: "https://lh3.googleusercontent.com/pw/AP1GczMJH_wLGYcpGcS7NQDBs25W32cU64Q7Qo1YfzoLoYdFDTUQRn_vr9KsPnQhP9421dYfDYtqGjIbp5atnfP6mDT6LV4xsQRSVwYZqtr8g02goiEiVbQJaw=w2400"
  },
  {
    id: 3,
    title: "Alumni Mentorship Program Launch",
    date: "March 10, 2025",
    readTime: "4 min read",
    excerpt: "Our new mentorship program connects CPSCS alumni with current students, providing guidance for their academic and professional journeys.",
    image: "https://lh3.googleusercontent.com/pw/AP1GczP2psGl-FOMO_vA858fb91ZO5VXFnZ3MX5waMIpFO70gwwWgJomeszGp4mRhCm5a3V_Ghf2TmmJ6_0Zn5obQCmQVQJf-uTzBJ_X71TnSv6AgDiecXZrJw=w2400"
  },
  {
    id: 4,
    title: "School Renovation Project Completed",
    date: "April 5, 2025",
    readTime: "6 min read",
    excerpt: "The alumni-funded renovation of the school library and science lab has been completed, providing state-of-the-art facilities for current students.",
    image: "https://lh3.googleusercontent.com/pw/AP1GczNvRSOEssX-vZpNnQyfh4OLYjxVMu1uLvjHVZH602cgECBZkW-VZFy1LEgCS5yvRwM7pqZtWWfNQP0l2qS5gE6ltAYbzqyQ9GJo1yJb5n-c_MBbBXydcw=w2400"
  }
];

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
          
          <div className="grid gap-8 md:grid-cols-2">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-500 mb-4">{post.date} • {post.readTime}</p>
                  <p className="mb-4">{post.excerpt}</p>
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
