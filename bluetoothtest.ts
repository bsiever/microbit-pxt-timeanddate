bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Sad)
})
input.onButtonPressed(Button.A, function () {
    basic.showString(timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
})
input.onButtonPressed(Button.B, function () {
    bluetooth.uartWriteLine(timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr))
})
bluetooth.startUartService()
bluetooth.startLEDService()
bluetooth.startButtonService()
timeanddate.setTime(11, 30, 0, timeanddate.MornNight.AM)
