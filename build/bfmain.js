import * as BFViewModel from './viewmodel.js';
(function () {
    //Setup options
    let enableDebugElement = document.getElementById('bf-options-debug');
    let convertOutputElement = document.getElementById('bf-options-output-convert');
    let memorySignedElement = document.getElementById('bf-options-memory-signed');
    let memorySizeElement = document.getElementById('bf-options-memory-size');
    let blockSizeElements = [
        document.getElementById('bf-options-memory-blocksize-char'),
        document.getElementById('bf-options-memory-blocksize-int16'),
        document.getElementById('bf-options-memory-blocksize-int32')
    ];
    let optionsVM = new BFViewModel.OptionsViewModel(enableDebugElement, convertOutputElement, memorySizeElement, memorySignedElement, blockSizeElements);
    //Default to first option
    blockSizeElements[0].click();
    //Setup debug
    let dumpTypes = [
        document.getElementById('modal-hex-dump'),
        document.getElementById('modal-decimal-dump'),
        document.getElementById('modal-ascii-dump')
    ];
    let memoryDumpList = document.getElementById('modal-memory-dumps');
    let memoryDumpBody = document.getElementsByClassName('modal-body-right')[0];
    let debugVM = new BFViewModel.DebugViewModel(memoryDumpList, memoryDumpBody, dumpTypes);
    //Setup interpreter
    let codeElement = document.getElementById('bf-code-text');
    let inputElement = document.getElementById('bf-code-input');
    let outputElement = document.getElementById('bf-results');
    let submitElement = document.getElementById('bf-code-execute');
    BFViewModel.InterpreterElementsSetup(codeElement, inputElement, outputElement, submitElement, optionsVM, debugVM);
})();
