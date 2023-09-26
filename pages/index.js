import FormNewModel from '@/components/FormNewModel'
import ListTickets from '@/components/ListTickets'
import Modal from '@/components/Modal'
import useBrowser from '@/hooks/useBrowser'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useRef } from 'react'
import { BsPlus } from 'react-icons/bs'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const modalRef = useRef()
    const { isSafari } = useBrowser()

    const handleCloseModal = () => {
        modalRef.current.close()
    }

    if (isSafari) {
        return (
            <div className='flex flex-col gap-2 justify-center items-center h-screen px-4'>
                <picture>
                    <img src="/next.svg" width={100} alt='logo' />
                </picture>
                <p className='text-center'>
                    Lo sentimos pero este sitio aún no es compatible con safari.
                </p>
                <p>
                    Usa chrome u otro navegador desde un pc.
                </p>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Genticket</title>
                <link rel="icon" href="next.svg" type="image/svg" />
            </Head>
            <div>
                <header className='bg-white shadow-sm z-50 noprinter sticky top-0 left-0 px-4 py-2 w-full flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <picture>
                            <img className='rounded-md' src="/next.svg" width={30} alt="logo" />
                        </picture>
                        <h4 className='font-semibold text-sm uppercase'>Generador de tickets</h4>
                    </div>
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

