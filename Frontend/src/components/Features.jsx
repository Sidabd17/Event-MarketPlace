import { FaCalendarPlus, FaTicketAlt, FaShieldAlt, FaBell } from "react-icons/fa";

const features = [
  {
    title: "Easy Event Creation",
    description: "Create and publish events in minutes.",
    icon: <FaCalendarPlus size={24} />,
    bg: "from-[#e0f7fa] to-[#b2ebf2] dark:from-[#1a2e35] dark:to-[#132024]",
  },
  {
    title: "Real-time Ticket Tracking",
    description: "Track availability and sales in real time.",
    icon: <FaTicketAlt size={24} />,
    bg: "from-[#fff3e0] to-[#ffe0b2] dark:from-[#2f1d0c] dark:to-[#1c1106]",
  },
  {
    title: "Verified Events",
    description: "Only authentic and trusted events.",
    icon: <FaShieldAlt size={24} />,
    bg: "from-[#ede7f6] to-[#d1c4e9] dark:from-[#2b233f] dark:to-[#1e1a2b]",
  },
  {
    title: "Instant Notifications",
    description: "Stay updated with real-time alerts.",
    icon: <FaBell size={24} />,
    bg: "from-[#fce4ec] to-[#f8bbd0] dark:from-[#361c2a] dark:to-[#1f111a]",
  },
];

const FeaturesSection = () => {
  return (
    <section className=" dark:bg-[#0a1216] py-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`p-6 border rounded-2xl shadow-md text-left text-gray-800 dark:text-white bg-gradient-to-br ${feature.bg}`}
            >
              <div className="mb-4 flex gap-2 text-primary">
                {feature.icon}
                 <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                </div>
              <p className="text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
