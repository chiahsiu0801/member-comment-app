import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FailedMessage from "../components/FailedMessage";
import Input from "../components/Input";

export default function Signup() {
  const [signupSuccess, setSignupSuccess] = useState(true);
  const [failedMessage, setFailedMessage] = useState('');

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onTouched'
  })

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('https://member-real-time-chatroom-kh1jbl21r-chiahsiu0801s-projects.vercel.app/signup', {
        data: data
      }, {withCredentials: true});

      setSignupSuccess(res.data.success);
      setFailedMessage('');

      if(res.data.success) {
        navigate('/roomlist');
      }
    } catch (error) {
      console.log(error);
      setSignupSuccess(error.response.data.success);
      setFailedMessage(error.response.data.message);
    }
  }

  return (
    <>
      <div className="w-[300px] md:w-[500px] bg-white p-8 rounded-md shadow-md m-auto">
        <h2 className="text-2xl font-semibold mb-5">Signup</h2>
        {
          (!signupSuccess) && <FailedMessage message={failedMessage} />
        }
        <form action="/signup" onSubmit={handleSubmit(onSubmit)} method="POST" noValidate>
          {/* Username input */}
          <Input labelText="Username" name="username" register={register} errors={errors} placeholder="Ex: Chiahsiu" rules={
            {
              required: {
                value: true,
                message: 'Username is required'
              }
            }
          } />
          <Input labelText="Email" name="email" register={register} errors={errors} placeholder="EX: test@test.com" rules={
            {
              required: {
                value: true,
                message: 'Email is required'
              },
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Email pattern is not correct',
              }
            }
          } />
          {/* Password input */}
          <Input labelText="Password" name="password" register={register} errors={errors} placeholder="EX: abc123456" rules={
            {
              required: {
                value: true,
                message: 'Password is required'
              },
              minLength: {
                value: 6,
                message: 'Password should exceed 6 characters in length'
              },
              maxLength: {
                value: 12,
                message: 'Password should not exceed 12 characters in length'
              }
            } 
          } />
          <Input labelText="Profile Image (Optional)" name="imageUrl" register={register} errors={errors} placeholder="Enter the image URL" />

          {/* Login button */}
          <button
            className="w-full bg-sky-500 text-white p-2 rounded mt-8 hover:bg-sky-700"
            type="submit"
          >
            Sign up
          </button>
        </form>
      </div>
    </>
  );
}