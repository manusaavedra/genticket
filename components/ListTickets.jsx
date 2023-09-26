import useFood from "@/hooks/useFood"
import useInput from "@/hooks/useInput"
import { convertToCurrency, dateformat } from "@/utils"
import Modal from "./Modal"
import FormNewModel, { FORM_MODE } from "./FormNewModel"
import { BsFiletypeCsv, BsPencil, BsPrinter, BsTrash } from "react-icons/bs"
import { useCallback, useRef } from "react"
import Barcode from "react-barcode"
import Swal from "sweetalert2"

export default function ListTickets() {
    const { foods, currentFood, addCurrent, remove } = useFood()
    const selectedFood = useInput('')
    const cantTickets = useInput(0)
    const modalFormEditRef = useRef()
    const ticketPerPage = 12

    const tickets = useCallback(() => {
        return Array.from({ length: cantTickets.value })
    }, [cantTickets.value])

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
            cantTickets.setValue(0)
            selectedFood.setValue('')
            remove(id)
        }
    }

    const handleChangeAdapter = (e) => {
        const { value: id } = e.target
        selectedFood.handleChange(e)

        if (id === '') {
            cantTickets.setValue(0)
            addCurrent(null)
        }

        const eat = foods.find((e) => e.id === id)

        if (eat) addCurrent(eat)
    }

    const handleBuildCsvTemplate = () => {
        if (tickets.length === 0) {
            return false
        }

        const { image, id, description, address, ...restFoodDataTemplate } = currentFood

        const csvHeaders = [
            "Nº ticket",
            "Nombre y Apellido",
            "Comida",
            "Precio",
            "Fecha",
            "Estado de pago",
            "Método de pago"
        ].join(',');

        const csvData = tickets.map((_, index) => Object.values(
            {
                ticket: String(index + 1).padStart(4, "1"),
                names: '',
                ...restFoodDataTemplate,
                paid: 'NO',
                paymentMethod: ''
            }
        ).join(','))

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
            <div className='noprinter flex overflow-hidden flex-col md:flex-row p-2 md:items-center justify-center gap-2 max-w-4xl bg-gray-100 mx-auto w-full'>
                <fieldset className='w-full flex items-center border p-2 gap-2'>
                    <legend className="text-sm font-medium">
                        Elegir comida
                    </legend>
                    <select className="w-40" value={selectedFood.value} onChange={handleChangeAdapter} name="venta">
                        <option value="">Seleccionar</option>
                        {
                            foods?.map((eat) => (
                                <option key={eat.id} value={eat.id}>
                                    {eat.title}
                                </option>
                            ))
                        }
                    </select>
                    {
                        currentFood && (
                            <div className="flex items-center gap-2">
                                <Modal ref={modalFormEditRef} className="border p-2" text={<BsPencil />}>
                                    <FormNewModel
                                        onAfterSubmit={handleAfterSaving}
                                        mode={FORM_MODE.EDIT}
                                        data={currentFood}
                                    />
                                </Modal>
                                <button onClick={() => handleRemoveFood(currentFood.id)} className="border p-2">
                                    <BsTrash />
                                </button>
                            </div>
                        )
                    }
                </fieldset>
                {
                    currentFood && (
                        <fieldset className="border p-2">
                            <legend className="text-sm font-medium">Numero de tickets</legend>
                            <input className="w-40" min={0} max={500} value={cantTickets.value} onChange={cantTickets.handleChange} type="number" name='number' />
                        </fieldset>
                    )
                }
                {
                    cantTickets.value > 0 && (
                        <fieldset className="flex gap-2 border p-2">
                            <button title="Imprimir" onClick={() => window.print()} className="border p-2">
                                <BsPrinter />
                            </button>
                            <button title="Descargar Plantilla" onClick={handleBuildCsvTemplate} className="border p-2">
                                <BsFiletypeCsv />
                            </button>
                        </fieldset>
                    )
                }
            </div>
            <div className="max-w-4xl mx-auto overflow-x-auto flex flex-wrap">
                {
                    tickets().length === 0 &&
                    <p className="mx-auto">
                        Indica el número de tickets
                    </p>
                }
                {
                    tickets().map((_, index) => {
                        const isBreakPage = (index + 1) % ticketPerPage === 0
                        const numberTicket = (index + 1)

                        return (
                            <div key={index} className={`${isBreakPage ? 'jumpPrinter' : ''} min-w-[10cm] p-2 flex items-center justify-between overflow-hidden border border-gray-200 border-dotted w-1/2 h-[4cm]`}>
                                <div className="w-28 flex flex-col justify-center items-center">
                                    <picture className="w-28 h-28 flex items-center justify-center overflow-hidden">
                                        <img
                                            className="block h-full"
                                            src={currentFood.image || '/next.svg'}
                                            alt=""
                                        />
                                    </picture>
                                    <div className="relative text-xs font-medium rounded-sm flex justify-center">
                                        <Barcode textMargin={0} fontSize={9} height={15} margin={2} width={1} value={String(numberTicket).padStart(4, "1")} />
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
                                <div className="w-[70px] flex justify-center items-center gap-0 border-l-2 border-dotted">
                                    <div className="h-5 bg-yellow-400 px-1 text-sm font-medium rounded-sm rotate-[-90deg]">
                                        {convertToCurrency(parseFloat(currentFood.price))}
                                    </div>
                                    <div className="font-medium ml-[-30px] rounded-sm flex justify-center rotate-[-90deg]">
                                        <Barcode textMargin={0} fontSize={14} height={15} margin={5} width={1} value={String(numberTicket).padStart(4, "1")} />
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