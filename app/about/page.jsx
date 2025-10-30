import Footer from "@/components/AboutPage/Footer";
import Header from "@/components/AboutPage/Header";
import ResearchCard from "@/components/AboutPage/ResearchCard";
export default function About() {
  const researchItems = [
    {
      id: 1,
      title: "The Impact of Menstrual Cycle on Mood",
      description: "This paper explores the relationship between hormonal fluctuations and emotional well-being.",
      icon: "psychology",
      color: "lavender",
      downloadLink: "#",
    },

    {
      id: 2,
      title: "Nutritional Considerations for Different Cycle Phases",
      description: "Discover dietary recommendations to support your body throughout your menstrual cycle.",
      icon: "restaurant",
      color: "sage-green",
      downloadLink: "#",
    },

    {
      id: 3,
      title: "Mindfulness and its Effect on Menstrual Symptoms",
      description: "Learn how mindfulness practices can help alleviate common menstrual discomforts.",
      icon: "self_improvement",
      color: "peach",
      downloadLink: "#",
    },
  ];

  return (
    <div className="flex flex-col h-auto min-h-screen w-full overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1">
            <Header />
            <main className="flex-1 py-10 px-4 sm:px-6">
              <div className="flex flex-wrap justify-between gap-6 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="font-bold text-3xl">About Femwell</p>
                  <p className="text-subtext-gray">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos saepe reiciendis odit mollitia fugit sint ullam reprehenderit pariatur eaque iusto, modi architecto ratione non! Quis optio culpa quod blanditiis perferendis?
                    Laboriosam officia velit blanditiis repellendus quisquam nam cumque quibusdam quae, commodi, cupiditate quia magni ipsam rerum! Ducimus fuga doloremque quasi sapiente hic perspiciatis mollitia, incidunt eveniet velit,
                    quidem cum tenetur.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-[22px] font-bold leading-tight tracking-[0.015em] px-4 pb-3 pt-5">Supporting Research</h2>

                <div className="flex flex-col gap-4">
                  {researchItems.map((item) => (
                    <ResearchCard key={item.id} {...item} />
                  ))}
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
