import * as BFViewModel from './viewmodel.js';

(function () {
    //Setup options
    let enableDebugElement = document.getElementById('bf-options-debug') as HTMLInputElement;
    let convertOutputElement = document.getElementById('bf-options-output-convert') as HTMLInputElement;
    let memorySignedElement = document.getElementById('bf-options-memory-signed') as HTMLInputElement;
    let memorySizeElement = document.getElementById('bf-options-memory-size') as HTMLInputElement;
    let blockSizeElements = [
        document.getElementById('bf-options-memory-blocksize-char') as HTMLInputElement,
        document.getElementById('bf-options-memory-blocksize-int16') as HTMLInputElement,
        document.getElementById('bf-options-memory-blocksize-int32') as HTMLInputElement
    ];
    let optionsVM = new BFViewModel.OptionsViewModel(
        enableDebugElement, 
        convertOutputElement, 
        memorySizeElement, 
        memorySignedElement, 
        blockSizeElements
    );
    //Default to first option
    blockSizeElements[0].click();

    //Setup debug
    let dumpTypes = [
        document.getElementById('modal-hex-dump') as HTMLInputElement,
        document.getElementById('modal-decimal-dump') as HTMLInputElement,
        document.getElementById('modal-ascii-dump') as HTMLInputElement
    ];
    let memoryDumpList = document.getElementById('modal-memory-dumps') as HTMLUListElement;
    let memoryDumpBody = document.getElementsByClassName('modal-body-right')[0] as HTMLDivElement;
    let debugVM = new BFViewModel.DebugViewModel(memoryDumpList, memoryDumpBody, dumpTypes);

    //Setup interpreter
    let codeElement = document.getElementById('bf-code-text') as HTMLTextAreaElement;
    let inputElement = document.getElementById('bf-code-input') as HTMLTextAreaElement;
    let outputElement = document.getElementById('bf-results') as HTMLTextAreaElement;
    let submitElement = document.getElementById('bf-code-execute') as HTMLInputElement;
    BFViewModel.InterpreterElementsSetup(
        codeElement, 
        inputElement, 
        outputElement, 
        submitElement, 
        optionsVM, 
        debugVM
    );
})();