import useFood from "@/hooks/useFood"
import useInput from "@/hooks/useInput"
import { convertToCurrency, dateformat } from "@/utils"
import Modal from "./Modal"
import FormNewModel, { FORM_MODE } from "./FormNewModel"
import { BsFiletypeCsv, BsPencil, BsPrinter, BsTrash } from "react-icons/bs"
import { useRef, useState } from "react"
import Barcode from "react-barcode"
import Swal from "sweetalert2"

export default function ListTickets() {
    const { foods, currentFood, addCurrent, remove } = useFood()
    const selectedFood = useInput('')
    const cantTickets = useRef()
    const startIndex = useRef()
    const modalFormEditRef = useRef()
    const ticketPerPage = 12
    const prefixNumberTicket = "T"
    const [tickets, setTickets] = useState([])

    const handleGenerateTickets = () => {
        const newTickets = Array.from({ length: cantTickets.current.value }, (_, index) => {
            return (parseInt(startIndex.current.value) || 1) + index;
        })
        setTickets(newTickets)
    }

    const handleAfterSaving = () => {
        modalFormEditRef.current.close()
    }

    const handleRemoveFood = async (id) => {
        const confirm = await Swal.fire({
            text: "Quieres eliminar está comida??",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            confirmButtonColor: "red"
        })

        if (confirm.isConfirmed) {
            cantTickets.current.value = 0
            selectedFood.setValue('')
            remove(id)
        }
    }

    const handleChangeAdapter = (e) => {
        const { value: id } = e.target
        selectedFood.handleChange(e)

        if (id === '') {
            cantTickets.current.value = 0
            addCurrent(null)
        }

        const eat = foods.find((e) => e.id === id)

        if (eat) addCurrent(eat)
    }

    const handleBuildCsvTemplate = () => {
        if (tickets.length === 0) {
            return false
        }

        const { title, price, date } = currentFood

        const csvHeaders = [
            "Nº ticket",
            "Nombre y Apellido",
            "Comida",
            "Fecha",
            "Precio",
            "Estado de pago",
            "Método de pago",
            "Entregado"
        ].join(',')

        const csvData = tickets
            .map((index) => {
                return [
                    prefixNumberTicket + String(index).padStart(4, "0"),
                    "",
                    title,
                    date,
                    price,
                    "FALSE",
                    "",
                    "FALSE"
                ].join(',')
            })

        const csv = `${csvHeaders}\n${csvData.join('\n')}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${currentFood.title} ${dateformat(currentFood.date)}.csv`;
        a.click();

        URL.revokeObjectURL(blobUrl);
    }

    return (
        <div>
            <div className='noprinter bg-gray-100 flex overflow-hidden flex-col md:flex-row p-2 md:items-center justify-start gap-2 max-w-4xl mx-auto w-full'>
                <fieldset className='flex items-center border p-2 gap-2'>
                    <legend className="text-sm font-medium">
                        Elegir comida
                    </legend>
                    <select className="w-40" value={selectedFood.value} onChange={handleChangeAdapter} name="venta">
                        <option value="">Seleccionar</option>
                        {
                            foods?.map((food) => (
                                <option key={food.id} value={food.id}>
                                    {food.title} - {dateformat(food.date)}
                                </option>
                            ))
                        }
                    </select>
                    {
                        currentFood && (
                            <div className="flex items-center gap-2">
                                <Modal ref={modalFormEditRef} className="p-2 border" text={<BsPencil />}>
                                    <FormNewModel
                                        onAfterSubmit={handleAfterSaving}
                                        mode={FORM_MODE.EDIT}
                                        data={currentFood}
                                    />
                                </Modal>
                                <button onClick={() => handleRemoveFood(currentFood.id)} className="border border-red-400 text-red-400 p-2">
                                    <BsTrash />
                                </button>
                            </div>
                        )
                    }
                </fieldset>
                {
                    currentFood && (
                        <fieldset className="flex items-center gap-2 border p-2">
                            <legend className="text-sm font-medium">Nº tickets</legend>
                            <div className="flex items-center gap-1">
                                <label className="text-xs">núm.</label>
                                <input ref={cantTickets} className="w-30" min={1} max={500} defaultValue={0} type="number" name='number' />
                            </div>
                            <div className="flex items-center gap-1">
                                <label className="text-xs">desde.</label>
                                <input ref={startIndex} className="w-30" min={1} max={499} defaultValue={1} type="number" name='startIndex' />
                            </div>
                        </fieldset>
                    )
                }
                <fieldset className="flex gap-2 border p-2">
                    <legend className="text-sm font-medium">Acciones</legend>
                    <button title="Imprimir" onClick={() => window.print()} className="border p-2">
                        <BsPrinter />
                    </button>
                    <button title="Descargar Plantilla" onClick={handleBuildCsvTemplate} className="border p-2">
                        <BsFiletypeCsv />
                    </button>
                </fieldset>
                <div>
                    <button disabled={!currentFood} onClick={handleGenerateTickets} className="bg-yellow-400 disabled:opacity-75">
                        Generar tickets
                    </button>
                </div>
            </div>
            <div className="max-w-4xl mx-auto overflow-x-auto flex flex-wrap">
                {
                    tickets.length === 0 &&
                    <p className="mx-auto">
                        Indica el número de tickets
                    </p>
                }
                {
                    tickets
                        .map((index) => {
                            const isBreakPage = (index) % ticketPerPage === 0
                            const numberTicket = prefixNumberTicket + String(index).padStart(4, "0")

                            return (
                                <div key={index} className={`${isBreakPage ? 'jumpPrinter' : ''} min-w-[10cm] p-2 flex items-center justify-between overflow-hidden border border-gray-200 border-dotted w-1/2 h-[4cm]`}>
                                    <div className="w-24 flex flex-col justify-center items-center">
                                        <picture className="w-24 h-24 flex items-center justify-center overflow-hidden">
                                            <img
                                                className={`block rounded-md h-full ${!currentFood.image ? 'saturate-0' : ''}`}
                                                src={currentFood.image || '/next.svg'}
                                                alt=""
                                            />
                                        </picture>
                                        <div className="relative text-xs font-medium rounded-sm flex justify-center">
                                            <Barcode textMargin={0} fontSize={9} height={15} margin={2} width={1} value={numberTicket} />
                                        </div>
                                    </div>
                                    <div className="w-[180px] px-3 flex flex-col gap-3">
                                        <div>
                                            <h4 className="font-bold text-base">
                                                {currentFood.title}
                                            </h4>
                                            <p className="text-xs">{currentFood.description}</p>
                                        </div>
                                        <div>
                                            <div>
                                                <label className="capitalize text-[12px]" htmlFor="">lugar:</label>
                                                <p className="text-xs">{currentFood.address}</p>
                                            </div>
                                            <p className="capitalize text-xs font-medium">
                                                {dateformat(currentFood.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-[80px] h-16 flex justify-center items-center border-l-2 border-dotted">
                                        <div className="h-5 bg-gray-700 ml-[10px] text-white border px-1 text-sm font-medium rounded-sm rotate-[-90deg]">
                                            {convertToCurrency(parseFloat(currentFood.price))}
                                        </div>
                                        <div className="font-medium ml-[-30px] rounded-sm flex justify-center rotate-[-90deg]">
                                            <Barcode textMargin={0} fontSize={14} height={15} margin={0} width={1} value={numberTicket} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        </div>
    )
}