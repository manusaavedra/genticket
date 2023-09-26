import useFood from "@/hooks/useFood"
import { generateRandomId, getDataForm, setFormFieldValues } from "@/utils"
import { useEffect, useRef } from "react"

export const FORM_MODE = {
    EDIT: "EDIT",
    CREATE: "CREATE"
}

export default function FormNewModel({ onAfterSubmit, data, mode = FORM_MODE.CREATE }) {
    const { save, update } = useFood()
    const formRef = useRef()

    useEffect(() => {
        const form = formRef.current

        if (mode === FORM_MODE.EDIT) {
            setFormFieldValues(formRef, { ...data })
        }

        return () => {
            form.reset()
        }
    }, [mode, data])

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = getDataForm(e.target)
        mode === FORM_MODE.CREATE
            ? save(formData)
            : update(formData)

        onAfterSubmit && onAfterSubmit()
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className='flex flex-col gap-2'>
            <div>
                <input type="text" disabled name='id' defaultValue={generateRandomId()} />
            </div>
            <div>
                <label htmlFor="name">Nombre de la venta</label>
                <input maxLength={30} autoFocus type="text" name='title' />
            </div>
            <div>
                <label htmlFor="image">URL de la imagen del plato</label>
                <input type="text" name='image' />
            </div>
            <div>
                <label htmlFor="name">Descripción</label>
                <textarea maxLength={50} className='resize-none' name='description'></textarea>
            </div>
            <div>
                <label htmlFor="name">Precio</label>
                <input type="number" step={0.1} name='price' />
            </div>
            <div>
                <label htmlFor="name">Lugar de venta</label>
                <input type="text" name='address' />
            </div>
            <div>
                <label htmlFor="name">Fecha de venta</label>
                <input type="date" name='date' />
            </div>
            <div>
                <button className='bg-gray-700 w-full p-2 text-white'>
                    Guardar
                </button>
            </div>
        </form>
    )
}