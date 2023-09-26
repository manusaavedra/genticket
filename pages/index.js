import FormNewModel from '@/components/FormNewModel'
import ListTickets from '@/components/ListTickets'
import Modal from '@/components/Modal'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { BsPlus } from 'react-icons/bs'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const modalRef = useRef()

    const handleCloseModal = () => {
        modalRef.current.close()
    }

    return (
        <>
            <Head>
                <title>Genticket</title>
                <link rel="icon" href="next.svg" type="image/svg" />
            </Head>
            <div>
                <header className='bg-white shadow-sm z-50 noprinter sticky top-0 left-0 px-4 py-2 w-full flex items-center justify-between'>
                    <h4 className='font-semibold text-sm uppercase'>Generador de tickets</h4>
                    <Modal className="p-2 border" ref={modalRef} text={<BsPlus size={20} />}>
                        <FormNewModel onAfterSubmit={handleCloseModal} />
                    </Modal>
                </header>
                <main className={`py-4 px-4 ${inter.className}`}>
                    <ListTickets />
                </main>
            </div>
        </>
    )
}

