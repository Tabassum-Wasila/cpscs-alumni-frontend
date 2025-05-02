
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Committee members data with real photos
const committeeMembers = [
  {
    id: 1,
    name: "Md. Abdul Karim",
    position: "President",
    batch: "1985",
    image: "https://lh3.googleusercontent.com/pw/AP1GczOjV4F8rUpPiX_7MwJX5K_XbR5315Xl44QLTNLShdz2HD8y9BwOIfcL7vHWXBGUrdXNrb4krGnd4eGnSyv61qQtBnnPm3QctkQHfrGMBawjJ-_XM6SP-w=w2400"
  },
  {
    id: 2,
    name: "Sonia Akhter",
    position: "Vice President",
    batch: "1992",
    image: "https://lh3.googleusercontent.com/pw/AP1GczPU_m0hv4u24TUsfQqsBC8BUSQIglem1B35ntR7DJnxmamnQcwlmgXuzkFR2pu5fx5Ud6bJfuww3f_zFd8CZLPI8gUbkeeSOpzM6vztuFU832z0AS5pnw=w2400"
  },
  {
    id: 3,
    name: "Shafiqul Islam",
    position: "General Secretary",
    batch: "1988",
    image: "https://lh3.googleusercontent.com/pw/AP1GczN1wJQ6_VQ6A5_pUZpRlnjaBjGXOhiyd7rZJpvF7Sc_7rqMXQbcyHPqGTv2X91ryMxHFGGEkqUMZhFsP_vFFn5twrVQVUZgAG1qkyo1iA2k_U01Ji_VqA=w2400"
  },
  {
    id: 4,
    name: "Rabeya Khatun",
    position: "Treasurer",
    batch: "1995",
    image: "https://lh3.googleusercontent.com/pw/AP1GczPo97OKC-fKffD8mFdfJja5YWGcOg5ocXVPvyWPUFvGqDXv_-i6iCoWpmPbXFOQCk7pnvFDyjzB87fM75mCVzWTH_LBcH8aZE9qPIjQrNq5hj38pOlb8Q=w2400"
  },
  {
    id: 5,
    name: "Mohammed Hossain",
    position: "Event Coordinator",
    batch: "1998",
    image: "https://lh3.googleusercontent.com/pw/AP1GczMJH_wLGYcpGcS7NQDBs25W32cU64Q7Qo1YfzoLoYdFDTUQRn_vr9KsPnQhP9421dYfDYtqGjIbp5atnfP6mDT6LV4xsQRSVwYZqtr8g02goiEiVbQJaw=w2400"
  },
  {
    id: 6,
    name: "Farida Rahman",
    position: "Media Coordinator",
    batch: "2001",
    image: "https://lh3.googleusercontent.com/pw/AP1GczP2psGl-FOMO_vA858fb91ZO5VXFnZ3MX5waMIpFO70gwwWgJomeszGp4mRhCm5a3V_Ghf2TmmJ6_0Zn5obQCmQVQJf-uTzBJ_X71TnSv6AgDiecXZrJw=w2400"
  }
];

const Committee = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16 bg-cpscs-light">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cpscs-blue mb-8">Executive Committee</h1>
          
          <div className="mb-8">
            <p className="text-lg">
              Meet the dedicated alumni who lead our association and organize our activities.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {committeeMembers.map((member) => (
              <div key={member.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                  <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-cpscs-blue">{member.position}</p>
                <p className="text-gray-500 mt-2">Class of {member.batch}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Committee;
