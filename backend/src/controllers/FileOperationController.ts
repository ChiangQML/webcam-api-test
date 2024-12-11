import {Request, Response} from "express";
import {CLog} from "../AppHelper";
import * as fs from "node:fs";


class FileOperationController{
    static getFile(req: Request, res: Response) {

        CLog.info('received one http request,,,,,')
        // file operation

        let newData = ''
        try {
            const tm = new Date().getTime()
            const data = fs.appendFileSync('./test.txt', tm.toString() + '\r\n', 'utf8')

            newData = fs.readFileSync('./test.txt', 'utf8')

        }
        catch (err) {
            CLog.bad('Error:', err)
            return res.send('Error in file operation', err.message)
        }

        return res.send(`write file okay :), --> ${newData}`)
    }

    // write apis to:
    // 1. open webcam
    // 2. close webcam
    // 3. take a photo
    // 4. list all photos
    // 5. delete a photo
    // 6. recording a video from desktop
    // 7. stop recording video
    // 8. list all videos

    // ORM


    static deleteFile(req: Request, res: Response) {
        // file operation
        try {
            fs.unlinkSync('./test.txt')
        }
        catch (err) {
            CLog.bad('Error:', err)
            return res.send('Error in file operation', err.message)
        }

        return res.send('delete file okay :)')
    }
}

export default FileOperationController