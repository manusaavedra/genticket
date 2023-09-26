import { useFoodStore } from "@/store"
import { useEffect } from "react"

export default function useFood() {
    const { foods, currentFood } = useFoodStore()

    useEffect(() => {
        const localFoods = localStorage.getItem("foods")
        if (localFoods) {
            useFoodStore.setState({ foods: JSON.parse(localFoods) })
        }
    }, [])

    const addCurrent = (food) => {
        useFoodStore.setState({ currentFood: food })
    }

    const save = (food) => {
        useFoodStore.setState({ foods: [...foods, food] })
        localStorage.setItem("foods", JSON.stringify([...foods, food]))
    }

    const update = (food) => {
        const newFoods = foods.map((oldFood) => {
            if (oldFood.id === food.id) {
                return food
            }

            return oldFood
        })

        useFoodStore.setState({ foods: newFoods, currentFood: food })
        localStorage.setItem("foods", JSON.stringify(newFoods))
    }

    const remove = (id) => {
        if (currentFood.id === id) {
            useFoodStore.setState({ currentFood: null })
        }

        const newFoods = foods.filter((food) => food.id !== id)
        useFoodStore.setState({ foods: newFoods })
        localStorage.setItem("foods", JSON.stringify(newFoods))
    }

    return {
        foods,
        currentFood,
        save,
        update,
        remove,
        addCurrent,
    }
}