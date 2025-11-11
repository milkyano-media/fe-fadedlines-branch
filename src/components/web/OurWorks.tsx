const images = [
    {
        id: 1,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/1.webp",
        alt: "",
    },
    {
        id: 2,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/2.webp",
        alt: "",
    },
    {
        id: 3,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/3.webp",
        alt: "",
    },
    {
        id: 4,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/4.webp",
        alt: "",
    },
    {
        id: 5,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/5.webp",
        alt: "",
    },
    {
        id: 6,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/6.webp",
        alt: "",
    },
    {
        id: 7,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/7.webp",
        alt: "",
    },
    {
        id: 8,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/8.webp",
        alt: "",
    },
    {
        id: 9,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/9.webp",
        alt: "",
    },
    {
        id: 10,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/10.webp",
        alt: "",
    },
    {
        id: 11,
        src: "https://s3.milkyano.com/milkyano/fadedlines-bentleigh/gallery/11.webp",
        alt: "",
    },
];

const CarauselGallery = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 justify-center items-center gap-y-4 md:gap-10 max-w-screen-lg self-center mt-10">
            {images.map((image) => (
                <img key={image.id} src={image.src} width={500} height={500} alt={image.alt} />
            ))}
        </div>
    );
};

export default CarauselGallery;
