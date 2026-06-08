import ExpertCard from "./ExpertCard";

const experts = [
  {
    id: 1,
    name: "Rajesh Electric Works",
    category: "Electrician",
    location: "Bhilwara",
    experience: "8 Years",
    rating: 4.9,
    reviews: 245,
    visitCharge: 499,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
  },

  {
    id: 2,
    name: "Mohan Electrical Services",
    category: "Electrician",
    location: "Udaipur",
    experience: "5 Years",
    rating: 4.8,
    reviews: 186,
    visitCharge: 399,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800",
  },

  {
    id: 3,
    name: "Amit Electric Solutions",
    category: "Electrician",
    location: "Jaipur",
    experience: "10 Years",
    rating: 5.0,
    reviews: 310,
    visitCharge: 599,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800",
  },

  {
    id: 4,
    name: "Suresh Home Services",
    category: "Electrician",
    location: "Kota",
    experience: "6 Years",
    rating: 4.7,
    reviews: 120,
    visitCharge: 349,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800",
  },

  {
    id: 5,
    name: "Vinod Repair Experts",
    category: "Electrician",
    location: "Ajmer",
    experience: "7 Years",
    rating: 4.8,
    reviews: 212,
    visitCharge: 449,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
  },

  {
    id: 6,
    name: "Professional Electric Care",
    category: "Electrician",
    location: "Jodhpur",
    experience: "12 Years",
    rating: 4.9,
    reviews: 402,
    visitCharge: 699,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
  },
];

const ExpertGrid = () => {
  return (
    <section className="py-16 bg-theme">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        {/* Header */}

        <div
          className="
            flex
            flex-col
            md:flex-row

            md:items-center
            md:justify-between

            gap-4

            mb-10
          "
        >
          <div>
            <h2
              className="
                text-3xl
                font-semibold
                text-primary
              "
            >
              Available Experts
            </h2>

            <p
              className="
                mt-2
                text-muted
              "
            >
              Browse verified professionals
              and choose the best match.
            </p>
          </div>

          <span
            className="
              px-4
              py-2

              rounded-xl

              bg-card

              border
              border-theme

              text-sm
              text-muted
            "
          >
            120 Experts Found
          </span>
        </div>

        {/* Grid */}

        <div
          className="
            grid

            md:grid-cols-2
            xl:grid-cols-3

            gap-8
          "
        >
          {experts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
            />
          ))}
        </div>

        {/* Load More */}

        <div
          className="
            flex
            justify-center

            mt-14
          "
        >
          <button
            className="
              px-8
              py-4

              rounded-2xl

              border
              border-theme

              text-primary

              hover:bg-card

              transition
            "
          >
            Load More Experts
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExpertGrid;