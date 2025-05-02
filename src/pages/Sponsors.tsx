
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Sponsor data with real images
const sponsors = [
  {
    id: 1,
    name: "Bangladesh Bank",
    logo: "https://lh3.googleusercontent.com/pw/AP1GczNvRSOEssX-vZpNnQyfh4OLYjxVMu1uLvjHVZH602cgECBZkW-VZFy1LEgCS5yvRwM7pqZtWWfNQP0l2qS5gE6ltAYbzqyQ9GJo1yJb5n-c_MBbBXydcw=w2400"
  },
  {
    id: 2,
    name: "Grameen Phone",
    logo: "https://lh3.googleusercontent.com/pw/AP1GczP_i84r9HbpR8fmnmeBSN4oURDMj38E34HPqzfOHj2tlK9xxu9mNXLshzZuJH1guXkNNDN09YoC7Xhm1AI0pKly8Akc5i9YVEej33hFVsXb-TbwJQ1scA=w2400"
  },
  {
    id: 3,
    name: "Dhaka Bank",
    logo: "https://lh3.googleusercontent.com/pw/AP1GczNzmC6aGcXiuQoGI8wqpw-5g3bUkDN9cKvDbpuX6MtnxNpj8a_x4wGUBbpZwKvKLqAYlduMgZNrB6ltpK6CcI-azyEWptJc4U_JoVH-QK1W-F-PWoU2IQ=w2400"
  },
  {
    id: 4,
    name: "Bkash",
    logo: "https://lh3.googleusercontent.com/pw/AP1GczPr4gh34mqfvZbPMDeiPpcfyKTsBvOSUvPGQStJmOUbKshsofkP7_4avpf6ysl3a50XprA_t13zdisKp3BacINH7AYYa0ijkF0bNpa45e8Ihgr8xQcSaA=w2400"
  },
  {
    id: 5,
    name: "Unilever",
    logo: "https://lh3.googleusercontent.com/pw/AP1GczPo97OKC-fKffD8mFdfJja5YWGcOg5ocXVPvyWPUFvGqDXv_-i6iCoWpmPbXFOQCk7pnvFDyjzB87fM75mCVzWTH_LBcH8aZE9qPIjQrNq5hj38pOlb8Q=w2400"
  },
  {
    id: 6,
    name: "Square Group",
    logo: "https://lh3.googleusercontent.com/pw/AP1GczMJH_wLGYcpGcS7NQDBs25W32cU64Q7Qo1YfzoLoYdFDTUQRn_vr9KsPnQhP9421dYfDYtqGjIbp5atnfP6mDT6LV4xsQRSVwYZqtr8g02goiEiVbQJaw=w2400"
  }
];

const Sponsors = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">Our Sponsors</h1>
          
          <div className="mb-8">
            <p className="text-lg">
              We gratefully acknowledge the generous support of our sponsors who help make our initiatives possible.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                <div className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{sponsor.name}</h3>
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

export default Sponsors;
