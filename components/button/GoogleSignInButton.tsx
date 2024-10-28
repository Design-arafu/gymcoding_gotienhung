import { signIn } from "next-auth/react";

interface GoogleSignButtonProps {
    children: React.ReactNode,
    isSubmitting: boolean
}

const GoogleSignButton = ({
    children,
    isSubmitting
}: GoogleSignButtonProps ) => {

    const loginWithGoogle = async () => {
        await signIn('google')
    }

    return (
        <div className='my-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='btn btn-primary w-full'
              onClick={loginWithGoogle}
            >
              {isSubmitting && (
                <span className='loading loading-spinner'></span>
              )}
              {children}
            </button>
          </div>
    )
}

export default GoogleSignButton