import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import MentorCard from "../common/MentorCard";
import { SERVER_URL } from '../../constant';
import { token } from './constants';
import axiosInstance from '../axiosConfig/axiosConfig';


const AllMentorsPage = () => {

   
    const [loading, setLoading] = useState(false);

    const [allMentors, setAllMentors] = useState([]);

    const getMentors = async () => {

        try {
            setLoading(true);
            const response = await axiosInstance.get('/allMentors',);
            // console.log(response.data);
            setAllMentors(response.data?.data);
            setLoading(false);

        } catch (error) {
            console.log(error)
            // toast.error("Something went wrong");
            setLoading(false);
        }
    }

    useEffect(() => {
        getMentors();
    }, []);

    return (
        <div>
            <div>
                <h1 className='font-bold text-3xl m-3 text-center'>
                    Our Mentors
                </h1>

                <div className='m-2 p-2 flex gap-3 flex-wrap justify-center items-center'>
                    {
                        loading ? <Spinner /> :
                            allMentors?.map((item) => 
                                    <div key={item?._id}>
                                        <MentorCard item={item} id={item._id} />
                                    </div>
                            )
                    }

                </div>

            </div>
        </div>
    );
}

export default AllMentorsPage;
