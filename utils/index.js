export const convertToCurrency = (number, currency = "EUR") => {
    if (number === null) return
    let value = isNaN(number) ? 0 : number

    const formattedNumber = value.toLocaleString('es-ES', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
    })

    const decimalSeparator = new Intl.NumberFormat('es-ES')
        .formatToParts(1.1)
        .find((part) => part.type === 'decimal').value;

    const thousandsSeparator = new Intl.NumberFormat('es-ES')
        .formatToParts(100000)
        .find((part) => part.type === 'group').value;

    return formattedNumber.replace(thousandsSeparator, '.')
        .replace(decimalSeparator, ',')
}

export const convertToPercentage = (number) => {
    if (number === null) return;
    let value = isNaN(number) ? 0 : number;

    const formattedNumber = value.toLocaleString('en-US', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formattedNumber;
}

export const groupBy = (x, f) => {
    return x.reduce((accumulator, currentValue, currentIndex) => {
        const key = f(currentValue, currentIndex, x);
        (accumulator[key] ||= []).push(currentValue);
        return accumulator;
    }, {});
}

export const getDataForm = (form) => {
    const formData = new FormData(form);

    const disabledInputs = form.querySelectorAll('input:disabled');
    disabledInputs.forEach(input => formData.append(input.name, input.value))

    const data = Object.fromEntries(formData.entries());
    return data
}

export const setFormFieldValues = (form, fieldValues) => {
    if (Object.keys(fieldValues).length === 0) {
        form.current.reset()
    } else {
        Object.keys(fieldValues).forEach((fieldName) => {
            if (form.current[fieldName])
                form.current[fieldName].value = fieldValues[fieldName]
        })
    }
}

export const generateRandomId = () => {
    const randomId = Math.random().toString(36).substring(2);
    return randomId;
}

export function dateformat(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
    }
    return new Date(date).toLocaleDateString('es-ES', options)
}