import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

interface MimeTypeValidatorResult {
  invalidMimeType?: boolean;
}

export const mimeType = (
  control: AbstractControl
): Promise<ValidationErrors | null> | Observable<MimeTypeValidatorResult | null> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  
  const file = control.value as File;
  if (!file) {
    return of({ invalidMimeType: true });
  }

  const fileReader = new FileReader();

  return new Observable((observer: Observer<MimeTypeValidatorResult | null>) => {

    const errorHandler = () => {
      observer.next({ invalidMimeType: true });
      observer.complete();
    };

    const loadEndHandler = () => {
      // Magic numbers for common image formats
      const validHeaders: { [key: string]: string } = {
        "89504e47": "PNG", // PNG
        "ffd8ffe0": "JPEG", // JPEG
        "ffd8ffe1": "JPEG", // JPEG
        "ffd8ffe2": "JPEG", // JPEG
        "ffd8ffe3": "JPEG", // JPEG
        "ffd8ffe8": "JPEG"  // JPEG
      };

      try {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = "";
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        const isValid = header in validHeaders;
        observer.next(isValid ? null : { invalidMimeType: true });
        observer.complete();
      } catch (error) {
        observer.next({ invalidMimeType: true });
        observer.complete();
      }
    };

    fileReader.addEventListener("error", errorHandler);
    fileReader.addEventListener("loadend", loadEndHandler);

    fileReader.readAsArrayBuffer(file);

    return () => {
      fileReader.removeEventListener("error", errorHandler);
      fileReader.removeEventListener("loadend", loadEndHandler);
      fileReader.abort();
    };
  });
};