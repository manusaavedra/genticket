import { forwardRef, useImperativeHandle, useState } from "react"

const Modal = forwardRef(function Modal({ children, text, className }, ref) {
    const [open, setOpen] = useState(false)

    useImperativeHandle(ref, () => {
        return {
            close: () => {
                setOpen(false)
            }
        }
    }, [])

    const toggleOpen = () => {
        setOpen(!open)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <button className={className} onClick={toggleOpen}>{text}</button>
            <div className={`${open ? 'block' : 'hidden'} fixed z-50 top-0 left-0 w-full h-screen`}>
                <div onClick={handleClose} className='absolute top-0 left-0 w-full h-full bg-black opacity-30'></div>
                <div className='p-4 top-14 mx-auto relative bg-white w-[90%] max-w-4xl rounded-md'>
                    {children}
                </div>
            </div>
        </>
    )
})

export default Modal