// Mock data for Bhaskar P Pittala's portfolio
export const personalInfo = {
  name: "Bhaskar P Pittala",
  handle: "BHASHER2229",
  tagline: "Passionate about securing systems and solving cybersecurity challenges",
  location: "Bangalore, India",
  email: "pittalabhasker2@gmail.com",
  phone: "+91 8499948773",
  github: "https://github.com/BHASHER2229",
  linkedin: "https://www.linkedin.com/in/pittala-bhasker-b4363224b",
  resume: "/resume.pdf" // Mock resume link
};

export const aboutInfo = {
  bio: `I'm a cybersecurity enthusiast and recent B.Tech graduate in Computer Science and Engineering (Cybersecurity) from Parul University. With hands-on experience as a Cybersecurity Intern at PNH Consulting Pvt. Ltd., I specialize in threat detection, penetration testing, and security analysis.

My journey into cybersecurity began with a realization of my passion during a QA role, which led me to relocate to Bangalore and dedicate myself to building practical skills. I've created a comprehensive home lab environment for ethical hacking practice and actively participate in bug bounty programs.

Currently pursuing CEH certification and continuously learning through platforms like TryHackMe and Hack The Box.`,
  education: [
    {
      degree: "B.Tech – Computer Science and Engineering (Cybersecurity)",
      institution: "Parul University, Vadodara",
      year: "2020 – 2024",
      cgpa: "7.43"
    },
    {
      degree: "Class 12 – Intermediate Board (MPC)",
      institution: "Narasaraopet",
      year: "2020",
      cgpa: "7.98"
    }
  ],
  experience: [
    {
      role: "Cybersecurity Intern",
      company: "PNH Consulting Pvt. Ltd.",
      period: "May 2024 – Dec 2024",
      description: "Supported security QA processes and gained exposure to professional environments. Focused on threat detection, issue reporting, and resolution under mentorship."
    }
  ]
};

export const projects = [
  {
    id: 1,
    title: "NotePass – Secure Password Manager",
    description: "An Android application that uses AES-256 encryption and master password for secure access. Integrated with Google Drive and local storage backup for reliability.",
    tech: ["Android Studio", "Java", "Firebase", "AES Encryption"],
    period: "Aug 2023 – Mar 2024",
    features: [
      "AES-256 encryption for password security",
      "Master password authentication",
      "Google Drive backup integration",
      "Local storage backup option",
      "Intuitive Android UI"
    ],
    github: "https://github.com/BHASHER2229/notepass",
    demo: "https://notepass-demo.com",
    image: "/images/notepass-preview.jpg"
  },
  {
    id: 2,
    title: "Bug Hunting – OpenBugBounty Platform",
    description: "Ongoing bug bounty activities focusing on XSS vulnerability discovery in live applications. Created PoC scripts for responsible disclosure.",
    tech: ["Burp Suite", "Firefox", "Google Dorks", "XSS"],
    period: "Ongoing",
    features: [
      "XSS vulnerability discovery",
      "Google Dorks for target discovery",
      "PoC script creation",
      "Responsible disclosure process",
      "Security assessment reports"
    ],
    github: "https://github.com/BHASHER2229/bug-hunting-tools",
    demo: "https://openbugbounty.org/researchers/BHASHER2229/",
    image: "/images/bug-hunting-preview.jpg"
  },
  {
    id: 3,
    title: "Cybersecurity Home Lab",
    description: "Virtualized cybersecurity environment for practicing ethical hacking and defense mechanisms. Configured multiple VMs for realistic attack scenarios.",
    tech: ["VirtualBox", "Kali Linux", "Ubuntu", "Windows 10", "pfSense"],
    period: "2024 – Present",
    features: [
      "Multi-VM environment setup",
      "Network scanning and enumeration",
      "Penetration testing practice",
      "Active Directory simulation",
      "Packet analysis and monitoring"
    ],
    github: "https://github.com/BHASHER2229/cybersecurity-homelab",
    demo: "https://homelab-documentation.com",
    image: "/images/homelab-preview.jpg"
  }
];

export const skills = {
  platforms: [
    { name: "Linux", level: 85, description: "Ubuntu, Kali Linux" },
    { name: "Android", level: 80, description: "App Development" },
    { name: "Windows", level: 75, description: "Windows 10/11" }
  ],
  tools: [
    { name: "Burp Suite", level: 90, description: "Web Application Testing" },
    { name: "Metasploit", level: 85, description: "Penetration Testing" },
    { name: "Nmap", level: 88, description: "Network Scanning" },
    { name: "Hydra", level: 80, description: "Password Cracking" },
    { name: "Wazuh", level: 75, description: "SIEM & Monitoring" },
    { name: "Splunk", level: 70, description: "Log Analysis" },
    { name: "Wireshark", level: 85, description: "Packet Analysis" }
  ],
  languages: [
    { name: "Bash", level: 85, description: "Shell Scripting" },
    { name: "Python", level: 70, description: "Automation & Scripting" },
    { name: "Java", level: 75, description: "Android Development" }
  ]
};

export const certifications = [
  {
    name: "Cybersecurity Essentials",
    issuer: "Cisco",
    status: "Completed",
    date: "2023",
    badge: "https://www.credly.com/badges/99193250-5e1a-4f1d-bf54-9356e39003b7/public_url"
  },
  {
    name: "CEH (Certified Ethical Hacker)",
    issuer: "EC-Council",
    status: "In Progress",
    date: "2024",
    badge: null
  },
  {
    name: "Google IT Support – Cybersecurity Internship",
    issuer: "Google",
    status: "Completed",
    date: "2024",
    badge: "https://www.credly.com/badges/99193250-5e1a-4f1d-bf54-9356e39003b7/public_url"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Security Team Lead",
    company: "PNH Consulting Pvt. Ltd.",
    text: "Bhaskar demonstrated exceptional dedication to learning cybersecurity concepts and showed great potential in threat detection and analysis.",
    avatar: "/images/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "Mentor",
    company: "Cybersecurity Community",
    text: "His commitment to building a comprehensive home lab and continuous learning through practical exercises is commendable.",
    avatar: "/images/testimonial-2.jpg"
  }
];

export const blogPosts = [
  {
    id: 1,
    title: "Building a Cybersecurity Home Lab: A Beginner's Guide",
    excerpt: "Learn how to set up your own virtualized cybersecurity environment for hands-on practice and skill development.",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["homelab", "virtualization", "cybersecurity"]
  },
  {
    id: 2,
    title: "XSS Vulnerability Discovery: My Bug Bounty Journey",
    excerpt: "Insights from discovering and reporting XSS vulnerabilities in live applications through responsible disclosure.",
    date: "2024-02-20",
    readTime: "6 min read",
    tags: ["bug bounty", "xss", "web security"]
  },
  {
    id: 3,
    title: "SIEM Implementation with Wazuh: A Practical Approach",
    excerpt: "Step-by-step guide to implementing Wazuh for security monitoring and log analysis in your environment.",
    date: "2024-03-10",
    readTime: "10 min read",
    tags: ["siem", "wazuh", "monitoring"]
  }
];

export const contactInfo = {
  email: "pittalabhasker2@gmail.com",
  phone: "+91 8499948773",
  location: "Bangalore, India",
  availability: "Available for cybersecurity roles and consulting opportunities",
  preferredContact: "email"
};