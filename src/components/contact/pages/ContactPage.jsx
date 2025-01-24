import { useAppContext } from "../../../context/AppContext";

const ContactPage = () => {
  const { settingsData } = useAppContext();

  return (
    <section className="md:ml-64 pt-20 px-[4%] bg-gray-100 dark:bg-gray-700 min-h-screen">
      <div className="w-full flex justify-between py-6 text-gray-900 dark:text-white">
        <h1 className="font-bold text-2xl">Sosyal Medya Bilgilerimiz</h1>
      </div>

      <div className="flex flex-col gap-3 py-5 px-3 text-sm relative shadow-md sm:rounded-lg">
        {settingsData.SocialMediaLinks.map((Link, i) => (
          <div key={i}>
            <p>{Link.Label}</p>
            <a href={Link.Link} target="_blank" className="text-blue-600">
              {Link.Link}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactPage;
