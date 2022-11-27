// components
import ExperienceTitleCard, {
  ExperinceTitleCardProps,
} from "@/components/experience-title-card/ExperinceTitleCard";

const EducationBackground: ExperinceTitleCardProps[] = [
  {
    title: "Bs. in Computer science",
    organizationName: "University of Dar es salaam",
    location: "Dar es salaam",
    duration: {
      from: new Date("Tuesday, December 19, 2017 12:11:01 AM"),
      to: new Date("Monday, October 19, 2020 12:11:01 AM"),
    },
  },
];

const Education = () => {
  return (
    <div className="nf-my-12">
      <h1 className="nf-text-3xl nf-font-semibold nf-text-primary">
        Education
      </h1>

      <div>
        {EducationBackground.map((item, index) => {
          return (
            <ExperienceTitleCard
              title={item.title}
              organizationName={item.organizationName}
              duration={item.duration}
              location={item.location}
              key={item.title + index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Education;
