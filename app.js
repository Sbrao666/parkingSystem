const fs = require('fs');
const inputFile = "./input.txt"
const outputFile = "./output.txt"

let currentSlotNumber = undefined

class Slot {
    constructor(parkingSlot, carNumber, driverAge) {
        this.parkingSlot = parkingSlot
        this.carNumber = carNumber
        this.driverAge = driverAge
    }
}

function writeOutputFile(dataString) {
    fs.writeFileSync(outputFile, dataString + "\n", {
        encoding: "utf8",
        flag: "a+",
        mode: 0o666
    })
}

function getInputList(data) {
    return data.split("\n")
}

function createParkingLot(command) {
    let status = false;
    const commandSplit = command.split(" ");
    if (commandSplit[0] === "Create_parking_lot") {
        const lotSize = parseInt(commandSplit[1])
        const data = `Created parking of ${lotSize} slots`
        writeOutputFile(data)
        return { status: true, lotSize }
    }
    return { status, lotSize: NaN };
}


function parkMyCar(lotSize, lotArray, carNumber, driverAge) {
    if (lotArray.length === lotSize) {
        console.log("Parking lot not having parking slot available.")
        return 0;
    }

    let slotNumber;
    if (currentSlotNumber === undefined) {
        slotNumber = lotArray.length + 1

    }
    else {
        slotNumber = currentSlotNumber
    }
    if (currentSlotNumber != undefined) currentSlotNumber = undefined
    const slot = new Slot(slotNumber, carNumber, parseInt(driverAge))
    lotArray.push(slot)
    const data = `Car with vehicle registration number \"${carNumber}\" has been parked at slot number ${slotNumber}`
    writeOutputFile(data)
    return
}

function leaveTheParking(slotNumber, lotArray) {
    let start = 0;
    let end = lotArray.length - 1;
    while (start <= end) {
        const mid = parseInt((start + end) / 2);
        if (lotArray[mid].parkingSlot === slotNumber) {
            currentSlotNumber = lotArray[mid].parkingSlot
            const data = `Slot number ${slotNumber} vacated, the car with vehicle registration number \"${lotArray[mid].carNumber}\" left the space, the driver of the car was of age ${lotArray[mid].driverAge}`
            lotArray.splice(mid, 1)
            writeOutputFile(data)
            break
        } else if (lotArray[mid].parkingSlot < slotNumber) {
            start = mid + 1
        } else {
            end = mid - 1;
        }
    }

}

function getSlotsUsingAge(age, lotArray) {
    let res = [];
    for (let i = 0; i < lotArray.length; i++) {
        if (lotArray[i].driverAge === age) {
            res.push(lotArray[i].parkingSlot)
        }
    }
    writeOutputFile(res)
}

function getSlotUsingCarNumber(carNumber, lotArray) {
    for (let i = 0; i < lotArray.length; i++) {
        if (lotArray[i].carNumber === carNumber.trim()) {
            writeOutputFile(lotArray[i].parkingSlot + "")
            break
        }
    }
}

function getAllRegistrationNumberUsingAge(age, lotArray) {
    let res = [];
    for (let i = 0; i < lotArray.length; i++) {
        if (lotArray[i].driverAge === age) {
            res.push(lotArray[i].carNumber)
        }
    }

    writeOutputFile(res)
}


function main() {
    try {
        fs.writeFileSync(outputFile, '')
        const inputString = fs.readFileSync(inputFile, 'utf-8')
        const inputList = getInputList(inputString);
        const response = createParkingLot(inputList[0])
        if (response.status) {
            const lotSize = response.lotSize
            const lotArray = []
            for (let i = 1; i < inputList.length; i++) {
                curInputList = inputList[i].split(" ");
                switch (curInputList[0]) {
                    case "Park":
                        parkMyCar(lotSize, lotArray, curInputList[1], curInputList[3])
                        break
                    case "Slot_numbers_for_driver_of_age":
                        getSlotsUsingAge(parseInt(curInputList[1]), lotArray)
                        break
                    case "Slot_number_for_car_with_number":
                        getSlotUsingCarNumber(curInputList[1], lotArray)
                        break
                    case "Leave":
                        leaveTheParking(parseInt(curInputList[1]), lotArray)
                        break
                    case "Vehicle_registration_number_for_driver_of_age":
                        getAllRegistrationNumberUsingAge(parseInt(curInputList[1]), lotArray)
                        break;
                    default:
                        console.log("Invalid command")
                        break
                }
            }

        } else {
            console.log("Parking lot not available, Please create it first")
        }
        const data = fs.readFileSync(outputFile, 'utf-8');
        const dataAsList = data.split("\n")
        console.log("Reading Output.txt")
        for (let i in dataAsList) {
            console.log(dataAsList[i])
        }

    } catch (error) {
        console.error("Got Error : " + error)
    }
}

main();