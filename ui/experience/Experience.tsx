import ExperienceTitleCard, { ExperinceTitleCardProps } from '@/components/experience-title-card/ExperinceTitleCard';

const WorkExperince: ExperinceTitleCardProps[] = [
  {
    title: " Fulltime Freelancing",
    organizationName: "Nelsonfrank consultation",
    location: "Dar es salaam",
    duration: {
      from: new Date("Tuesday, August 19, 2022 12:11:01 AM"),
      to: "Present",
    },
    Flag: "🇹🇿",
  },
  {
    title: "Fullstack engineer",
    organizationName: "Simba developer by Africab",
    location: "Dar es salaam",
    duration: {
      from: new Date("Tuesday, June 19, 2022 12:11:01 AM"),
      to: new Date("Tuesday, August 19, 2022 12:11:01 AM"),
    },
    Flag: "🇹🇿",
  },
  {
    title: "Javascript/Typescript Fullstack engineer",
    organizationName: "Sndbx by id8",
    location: "Dar es salaam",
    duration: {
      from: new Date("Tuesday, December 19, 2021 12:11:01 AM"),
      to: new Date("Tuesday, August 19, 2022 12:11:01 AM"),
    },
    Flag: "🇹🇿",
  },
  {
    title: "React Developer",
    organizationName: "Databalk",
    location: "Netherlands",
    duration: {
      from: new Date("Tuesday, October 19, 2021 12:11:01 AM"),
      to: new Date("Monday, January 19, 2022 12:11:01 AM"),
    },
    Flag: "🇳🇱",
  },
  {
    title: "Javascript fullstack engineer",
    organizationName: "Nipale",
    location: "Dar es salaam",
    duration: {
      from: new Date("Tuesday, January 19, 2021 12:11:01 AM"),
      to: new Date("Monday, August 19, 2021 12:11:01 AM"),
    },
    Flag: "🇹🇿",
  },
  {
    title: "Front-end engineer",
    organizationName: "Id8 Space",
    location: "Dar es salaam",
    duration: {
      from: new Date("Tuesday, May 19, 2020 12:11:01 AM"),
      to: new Date("Monday, January 19, 2021 12:11:01 AM"),
    },
    Flag: "🇹🇿",
  },
];

const Experience = () => {
  return (
    <div>
      <h1 className="nf-text-3xl nf-font-semibold nf-text-primary">
        Work experince
      </h1>
      <div>
        {WorkExperince.map((item, index) => (
          <ExperienceTitleCard
            title={item.title}
            organizationName={item.organizationName}
            duration={item.duration}
            location={item.location}
            Flag={item.Flag}
            key={item.title + index}
          />
        ))}
      </div>
    </div>
  );
};

export default Experience