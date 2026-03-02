import gallery1 from "@/assets/web/gallery/gallery_1.png";
import gallery2 from "@/assets/web/gallery/gallery_2.png";
import gallery3 from "@/assets/web/gallery/gallery_3.png";
import gallery4 from "@/assets/web/gallery/gallery_4.png";
import gallery5 from "@/assets/web/gallery/gallery_5.png";
import gallery6 from "@/assets/web/gallery/gallery_6.png";
import gallery7 from "@/assets/web/gallery/gallery_7.png";
import gallery8 from "@/assets/web/gallery/gallery_8.png";
import gallery9 from "@/assets/web/gallery/gallery_9.png";
import gallery10 from "@/assets/web/gallery/gallery_10.png";
import gallery11 from "@/assets/web/gallery/gallery_11.png";
import gallery12 from "@/assets/web/gallery/gallery_12.png";

const images = [
    { id: 1, src: gallery1, alt: "" },
    { id: 2, src: gallery2, alt: "" },
    { id: 3, src: gallery3, alt: "" },
    { id: 4, src: gallery4, alt: "" },
    { id: 5, src: gallery5, alt: "" },
    { id: 6, src: gallery6, alt: "" },
    { id: 7, src: gallery7, alt: "" },
    { id: 8, src: gallery8, alt: "" },
    { id: 9, src: gallery9, alt: "" },
    { id: 10, src: gallery10, alt: "" },
    { id: 11, src: gallery11, alt: "" },
    { id: 12, src: gallery12, alt: "" },
];

const CarauselGallery = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 justify-center items-center gap-4 md:gap-10 max-w-screen-lg self-center mt-10">
            {images.map((image) => (
                <div key={image.id} className="aspect-square overflow-hidden">
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>
    );
};

export default CarauselGallery;
