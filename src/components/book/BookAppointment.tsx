/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useId, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar"
import LogoImg from "@/assets/web/icons/logo.png"
import { Link, useLocation } from 'react-router-dom';
import { format } from "date-fns";
import moment from 'moment-timezone';
import { useNavigate } from "react-router-dom";
import { getAvailability } from '@/utils/barberApi';
import { Availability, AvailabilityResponse, ServicesItem } from '@/interfaces/BookingInterface';
import Spinner from '../web/Spinner';

interface appointmentData {
  start_at: string;
  readable_time: string;
}

interface TimeOfDay {
  title: string,
  appointments: appointmentData[]
}

const BookAppointment = () => {
  const location = useLocation();
  const currentDate = new Date();
  const inputId = useId();
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<AvailabilityResponse>();
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [availabilitybyDate, setAvailabilitybyDate] = useState<Availability[] | undefined>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [bookedItems, setBookedItems] = useState<ServicesItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidDate, setIsValidDate] = useState<boolean>(true);
  const [nextAvailable, setNextAvailable] = useState<Date>(new Date(currentDate));
  const startAt = new Date(currentDate);
  const endAt = new Date(currentDate);
  endAt.setDate(endAt.getDate() + 30);

  const formatPrice = (priceAmount: number, currency: string = "AUD"): string => {
    // Convert from cents to dollars
    const dollars = priceAmount / 100;
    return `$${dollars.toFixed(2)} ${currency}`;
  };

  const generateRoute = (route: string): string => {
    const parts = location.pathname.split("/");
    if (parts[1] === 'meta') {
      if (parts[2] === 'book')
        return `/meta/${route}`;
      else return `/meta/${parts[2]}/${route}`;
    }
    else {
      if (parts[1] === 'book')
        return `/${route}`;
      else return `/${parts[1]}/${route}`;
    }
  }

  useEffect(() => {
    const currentDate = new Date();
    setInputValue(format(currentDate, "MM/dd/yyyy"));
    const items = localStorage.getItem('bookedItems');
    if (items) {
      setBookedItems(JSON.parse(items));
    }
  }, []);

  const fetchMultipleMonthsData = async (numberOfMonths: number) => {
    setIsLoading(true);
    const allAvailabilities: any[] = [];
    if (bookedItems.length > 0) {
      for (let i = 0; i < numberOfMonths; i++) {

        if (i === 1) {
          startAt.setDate(startAt.getDate() + 30);
          endAt.setDate(endAt.getDate() + 30);
        }

        const requestBody = {
          "service_variation_id": bookedItems[0].item_data.variations[0].id,
          "start_at": moment.tz(startAt, "Australia/Sydney").format(),
          "end_at": moment.tz(endAt, "Australia/Sydney").format()
        };

        const response = await getAvailability(requestBody);
        allAvailabilities.push(...response.availabilities);
      }
    }
    setIsLoading(false)
    return allAvailabilities;
  };

  useEffect(() => {
    const numberOfMonths = 2;
    fetchMultipleMonthsData(numberOfMonths).then((availabilities) => {
      setAvailableDates({ availabilities });

      const appointmentSegment = availabilities[0]?.appointment_segments;
      const locationId = availabilities[0]?.location_id;

      localStorage.setItem('appointmentSegment', JSON.stringify(appointmentSegment));
      localStorage.setItem('locationId', JSON.stringify(locationId));
    });
  }, [bookedItems]);

  useEffect(() => {
    const today = new Date();
    const unavailable = [];
    for (let i = 0; i <= 60; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const availability = checkAvailabilityByDate(checkDate);
      if (!availability) {
        unavailable.push(new Date(checkDate));
      }
    }
    if (availableDates?.availabilities[0]) {
      const nextDate: Date = new Date(availableDates.availabilities[0].start_at);
      setNextAvailable(nextDate);
    }
    setUnavailableDates(unavailable);
  }, [availableDates])


  function findAvailabilityByDate(date: Date) {
    const dateAEST = moment.tz(date, 'Australia/Sydney').startOf('day');

    const results = availableDates?.availabilities.filter((item: { start_at: string; }) => {
      const itemDate = moment.tz(item.start_at, 'Australia/Sydney').startOf('day');
      return dateAEST.isSame(itemDate, 'day');
    });

    setAvailabilitybyDate(results);
    return results && results.length > 0 ? results : null;
  }

  function checkAvailabilityByDate(date: Date) {
    const dateAEST = moment.tz(date, 'Australia/Sydney').startOf('day');
    const result = availableDates?.availabilities.some((item: { start_at: string; }) => {
      const itemDate = moment.tz(item.start_at, 'Australia/Sydney').startOf('day');
      return dateAEST.isSame(itemDate, 'day');
    });
    findAvailabilityByDate(new Date());

    return result;
  }


  const handleDayPickerSelect = async (date: Date | undefined) => {
    if (!date) {
      setIsValidDate(false);
      setInputValue(format(new Date(), "MM/dd/yyyy"));
      setSelectedDate(new Date());
    } else {
      setIsValidDate(true);
      setSelectedDate(date);
      setMonth(date);
      setInputValue(format(date, "MM/dd/yyyy"));
      const formattedDate = date.toLocaleDateString('en-AU', { weekday: 'long', month: 'short', day: 'numeric' }).replace(/(\w+), (\w+) (\d+)/, '$1, $2 $3');
      date.setHours(currentDate.getHours() - 2);

      const day = date.getDate();
      const dayName = date.toLocaleDateString('en-AU', { weekday: 'long' });
      const monthName = date.toLocaleDateString('en-AU', { month: 'short' });
      const month = date.getMonth();
      const year = date.getFullYear();
      const time = date.toLocaleDateString('en-AU', { weekday: 'long', month: 'short', day: 'numeric' }).replace(/(\w+), (\w+) (\d+)/, '$1, $2 $3');

      const dateObject = {
        dayName: dayName,
        monthName: monthName,
        day: day,
        month: month,
        year: year,
        time: time
      };

      localStorage.setItem('dateObject', JSON.stringify(dateObject));
      localStorage.setItem('formattedDate', formattedDate);

      findAvailabilityByDate(date);
    }
  };

  const updateTimesOfDayWithAppointments = () => {
    const timesOfDay: TimeOfDay[] = [
      { title: "Morning", appointments: [] },
      { title: "Afternoon", appointments: [] },
      { title: "Evening", appointments: [] }
    ];

    availabilitybyDate?.forEach(appointment => {
      const startAt = new Date(appointment.start_at);
      const hour = startAt.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', hour12: false });

      let timeOfDayIndex;
      if (parseInt(hour) < 12) timeOfDayIndex = 0;
      else if (parseInt(hour) >= 12 && parseInt(hour) < 17) timeOfDayIndex = 1;
      else timeOfDayIndex = 2;

      const readableTime = startAt.toLocaleString('en-AU', { timeZone: 'Australia/Sydney', hour: 'numeric', minute: 'numeric', hour12: true });
      timesOfDay[timeOfDayIndex].appointments.push(
        {
          start_at: appointment.start_at,
          readable_time: readableTime
        }
      );
    });

    return timesOfDay;
  };
  const timesOfDayWithAppointments = updateTimesOfDayWithAppointments();

  return (
    <section className="relative bg-transparent flex flex-col px-4 pt-28 pb-12 items-center md:items-start justify-center z-30 md:px-40 min-h-screen gap-0 font-body text-[#F0F0F0]"  >
      <div
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-center border-b-[0.5px] border-white/60 shadow-lg shadow-black/20 backdrop-blur-md"
        style={{ background: "rgba(74, 74, 74, 0.8)" }}
      >
        <Link to={"/home"}>
          <img src={LogoImg} alt="Fadedlines Bentleigh" className="h-16 w-auto" />
        </Link>
      </div>
      {
        !isLoading && unavailableDates ? (
          <>
            <section className='grid grid-cols-1 md:grid-cols-3 gap-4 relative z-40 w-full'>
              <div className='col-span-2'>
                <Calendar
                  mode="single"
                  className="rounded-md border-none p-0 py-3 md:mr-4"
                  selected={selectedDate}
                  onSelect={handleDayPickerSelect}
                  month={month}
                  onMonthChange={setMonth}
                  fromMonth={new Date()}
                  disabledDates={unavailableDates} />
              </div>
              <div className='flex flex-col rounded-3xl py-4 md:p-4'>
                <h3 className='font-display text-5xl md:text-4xl font-normal leading-tight'>Appointment Summary</h3>
                <div className='flex flex-col gap-2 border border-white/70 bg-[#2B2B2B] p-4 rounded-xl text-sm mt-6'>
                  {bookedItems.length > 0 ? (
                    bookedItems.map((item) => (
                      <div key={item.id}>
                        <h4 className='font-medium'>{item.item_data.name}</h4>
                        <div className='flex gap-2 text-xs font-light'>
                          <p>
                            {formatPrice(
                              item.item_data.variations[0].item_variation_data.price_money.amount,
                              item.item_data.variations[0].item_variation_data.price_money.currency
                            )}
                          </p>
                          {/* <span>•</span>
                          <p>{item.item_data.variations[0].item_variation_data.service_duration} Mins</p> */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Loading services...</p>
                  )}
                </div>

              </div>
            </section>
            <section className=" flex flex-col relative z-40 px-4 w-full text-start gap-2 md:gap-4 text-[#F0F0F0] text-sm mt-8 ">
              <div>
                <label htmlFor={inputId} className='font-display text-lg'>
                  {isValidDate ? (
                    <span>{format(inputValue, "EEEE, MMMM d")}</span>
                  ) : (
                    <strong>Please select a valid date</strong>
                  )}

                </label>
              </div>
              <section className='flex flex-col gap-8 pt-'>

                {availabilitybyDate?.length ?? 0 > 0 ? (
                  timesOfDayWithAppointments.length > 0 ? (
                    timesOfDayWithAppointments.map(timeOfDay => (
                      <div key={timeOfDay.title} className='flex flex-col gap-2'>
                        <h3 className='font-display text-5xl md:text-4xl font-normal leading-tight'>{timeOfDay.title}</h3>
                        <ul className='flex gap-3 w-full flex-wrap'>
                          {timeOfDay.appointments.length > 0 ? (
                            timeOfDay.appointments.map((appointment, index) => (
                              <Button
                                key={index}
                                className='w-fit text-xs h-fit py-1.5 px-4 rounded bg-[#C4C4C0] text-[#2B2B2B] font-medium hover:bg-[#E3E0DA]'
                                onClick={() => {
                                  localStorage.setItem('appointmentStartAt', appointment.start_at);
                                  localStorage.setItem('selectedAppointment', appointment.readable_time);
                                  navigate(generateRoute("book/contact-info"));
                                }}
                              >
                                {appointment.readable_time}
                              </Button>
                            ))
                          ) : (
                            <p>No appointments available.</p>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p>No appointments available.</p>
                  )
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setInputValue(format(nextAvailable, 'MM/dd/yyyy'))
                        findAvailabilityByDate(nextAvailable)
                      }}
                      className='w-[100%] lg:w-[60%] bg-[#C4C4C0] text-[#2B2B2B] hover:bg-[#E3E0DA]'>Go to next available</Button>
                    <p className=' font-large'>No availability until {format(nextAvailable, "EEEE, MMMM d")}</p>
                  </>

                )}
              </section>
            </section></>
        ) : (
          <div className='w-full flex flex-col gap-6 justify-center items-center'>
            <h3 className='text-xl font-bold'>Loading data...</h3>
            <Spinner />
          </div>
        )
      }

    </section >
  )
}

export default BookAppointment
