import React from 'react'
import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import {events} from "@/lib/constant";


const Page = () => {
    return (
        <section>
            <h1 className="text-center">The Hub For Every Dev <br/> Event You Can't Miss </h1>
            <p className="text-center mt-5">Hackathons, Meetup and Conferences, All in One Place</p>
            <ExploreBtn/>

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events.map((event)=>(
                        <li className="list-none" key={event.title}>
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>

            </div>
        </section>
    )
}
export default Page
