import Clipper from "@/assets/web/careers/clipper.svg";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BookNowButton from "@/components/web/BookNowButton";
import Spinner from "@/components/web/Spinner";
import Layout from "@/components/web/WebLayout";
import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Check, X } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { z } from "zod";

export default function Careers() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("loading");

    localStorage.removeItem("booking_source");

    const location = useLocation();

    const getQueryParams = (search: string) => {
        return new URLSearchParams(search);
    };

    const queryParams = getQueryParams(location.search);
    const fbclid = queryParams.get("fbclid");
    const ttclid = queryParams.get("ttclid");
    const gclid = queryParams.get("gclid");

    const trackingData = {
        utm_source: queryParams.get("utm_source"),
        utm_medium: queryParams.get("utm_medium"),
        utm_campaign: queryParams.get("utm_campaign"),
        utm_content: queryParams.get("utm_content"),
        fbclid: queryParams.get("fbclid"),
    };

    localStorage.setItem("booking_source", JSON.stringify(trackingData));

    if (trackingData.fbclid && trackingData.utm_source) {
        localStorage.setItem("customer_source", JSON.stringify(trackingData));
    }

    localStorage.setItem("utm_source", queryParams.get("utm_source") || "None");
    localStorage.setItem("utm_medium", queryParams.get("utm_medium") || "None");
    localStorage.setItem("utm_campaign", queryParams.get("utm_campaign") || "None");
    localStorage.setItem("utm_content", queryParams.get("utm_content") || "None");

    if (fbclid) {
        localStorage.setItem("booking_origin", "facebook");
    } else if (ttclid) {
        localStorage.setItem("booking_origin", "tiktok");
    } else if (gclid) {
        localStorage.setItem("booking_origin", "google");
    } else {
        localStorage.setItem("booking_origin", "organic");
    }

    const formSchema = z.object({
        fullName: z.string().min(2).max(50),
        email: z.string().email(),
        phoneNumber: z.string().min(10).max(15),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
        },
    });

    const sendEmail = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setStatus("loading");

        emailjs
            .send("service_8g1wzub", "template_oqnkkb8", values, "dVQ8-b1hMOSkncafw")
            .then(() => {
                setStatus("succeeded");

                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            })
            .catch(() => {
                setStatus("failed");
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            });
    };

    return (
        <Layout>
            <Helmet>
                <title>Careers - Fadelines Barber Shop</title>
                <meta
                    name="description"
                    content="Fadelines - A premier barber shop offering top-notch haircuts and styles."
                />
                <meta property="og:title" content="Fadelines Barber Shop" />
                <meta
                    property="og:description"
                    content="Fadelines - A premier barber shop offering top-notch haircuts and styles."
                />
                <meta property="og:image" content="URL to Fadelines' preview image" />
                <meta property="og:url" content="URL to Fadelines' website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <section className="flex flex-col justify-center items-center relative pt-40">
                <div className="top-0 absolute w-full h-full object-cover z-0 bg-gradient-to-b from-concrete-dark-80/80 to-concrete-dark-80" />
                <div className="flex flex-col justify-center items-center text-center gap-6 z-10">
                    <div className="flex flex-col mb-12">
                        <h2 className="text-lime">JOIN THE BEST</h2>
                        <h2>BARBERSHOP IN MELBOURNE</h2>
                        <sub className="mt-6">
                            Are you qualified to be in our <span className="text-lime">team?</span>
                        </sub>
                    </div>

                    <svg className="w-7 mt-20" viewBox="0 0 55 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M50.582 0.216618L54.9987 4.63745L30.9279 28.7166C30.5422 29.1048 30.0835 29.4128 29.5783 29.623C29.0731 29.8332 28.5313 29.9414 27.9841 29.9414C27.4369 29.9414 26.8951 29.8332 26.3899 29.623C25.8847 29.4128 25.4261 29.1048 25.0404 28.7166L0.957032 4.63745L5.3737 0.220782L27.9779 22.8208L50.582 0.216618Z"
                            fill="#33FF00"
                        />
                    </svg>
                </div>
            </section>

            <div className="flex flex-col text-stone-50 w-full relative tracking-wider">
                <AlertDialog open={isLoading} onOpenChange={setIsLoading}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">Sending Email</AlertDialogTitle>
                            <AlertDialogDescription>
                                {status === "loading" ? (
                                    <Spinner />
                                ) : status === "succeeded" ? (
                                    <div className="flex justify-center items-center p-4  md:p-12 animate-scaleIn">
                                        <div className="p-1  rounded-full border border-lime">
                                            <Check className="h-24 w-auto md:h-24 md:w-24 text-lime " />
                                        </div>
                                    </div>
                                ) : status === "failed" ? (
                                    <div className="flex justify-center items-center p-4  md:p-12 animate-scaleIn">
                                        <div className="p-1  rounded-full border border-red-600">
                                            <X className="h-24 w-auto md:h-24 md:w-24 text-red-600 " />
                                        </div>
                                    </div>
                                ) : null}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>

                <section className="bg-concrete-dark-80 flex gap-4 md:gap-32 flex-col md:flex-row relative z-30 container justify-center md:pt-12  items-center ">
                    <div className="w-7/12 md:w-1/5 pt-12 pb-24 md:pb-0 md:pt-0">
                        <img src={Clipper} alt="clipper" className="w-full" />
                    </div>

                    <div className="w-full md:w-6/12">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(sendEmail)}
                                className="grid grid-cols-1 gap-4 pb-12 w-full"
                            >
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-col justify-center items-center rounded-lg p-3 bg-[#262626] placeholder-[#B3E7C9]">
                                            <FormLabel className="w-full flex justify-start">
                                                <span className="text-stone-50 font-extrabold text-lg text-start w-full">
                                                    Full Name
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Johnathan"
                                                    className="placeholder:text-[#114330] bg-transparent focus-visible:outline-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-col justify-center items-center rounded-lg p-3 bg-[#262626] placeholder-[#B3E7C9]">
                                            <FormLabel className="w-full flex justify-start">
                                                <span className="text-stone-50 font-extrabold text-lg text-start w-full">
                                                    Email
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="johnathan@example.com"
                                                    className="placeholder:text-[#114330] bg-transparent focus-visible:outline-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem className="w-full flex flex-col justify-center items-center rounded-lg p-3 bg-[#262626] placeholder-[#B3E7C9]">
                                            <FormLabel className="w-full flex justify-start">
                                                <span className="text-stone-50 font-extrabold text-lg text-start w-full">
                                                    Phone Number
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="+61 4XX XXX XXX"
                                                    className="placeholder:text-[#114330] bg-transparent focus-visible:outline-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <BookNowButton className="w-full py-6 text-xl" type="submit">
                                    CONTINUE
                                </BookNowButton>
                            </form>
                        </Form>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
