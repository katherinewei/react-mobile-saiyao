import React, {PropTypes} from "react";
import {connect} from 'dva'
import { Toast,Button} from "antd-mobile";
import {getString} from "../utils/helper";
import {image_cloud} from "../config";
import CryptoJS, {SHA1} from 'crypto-js'

const ImageUploader = ({dispatch, uid, onUpload, input,imgSize, outputs, hint,  children,images:{loading}}) => {

    function handleUpload(e) {
        const file = e.target.files[0];
        let image_type = 'image/jpg,image/jpeg,image/png';

        if(file){
            if(image_type.indexOf(file.type) == -1){
                return Toast.fail('不支持'+file.type)
            }
        }
        let reader = new FileReader();
        reader.onload = () => {
            const sha = SHA1(reader.result).toString(CryptoJS.enc.Hex);

            const image = new Image();
            image.onload = () => {
                const width = image.width;
                const height = image.height;
                if(imgSize && (1024*imgSize*1000)  < file.size){
                    Toast.fail('文件大小超过'+imgSize+'M');
                }
                else if (input && !input(width, height)) {
                    Toast.fail(getString(hint))
                }
                else {
                    formatUrl(image, image_cloud + sha, file)
                }
            };

            image.src = reader.result
        };
        reader.readAsDataURL(file)
    }

    function formatUrl(image, urlPrefix, file) {
        const extension = file.name.toLowerCase().lastIndexOf('png') > -1 ? 'png': 'jpg';

        //const extension = 'jpg';
        if (outputs && outputs.length > 0) {
            outputs.map((block) => {
                const [w, h] = block.split('x').map(item => parseInt(item));
                const url = getString('{0}-{1}x{2}.{3}', urlPrefix, w, h, extension);
                renderImage(image, url, w, h, extension)
            })
        } else {
            const url = getString('{0}-{1}x{2}.{3}', urlPrefix, image.width, image.height, extension);
            renderImage(image, url, image.width, image.height, extension)
        }
    }

    function renderImage(image, url, width, height, type) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);
        if (type === 'png') {
            if (canvas.toBlob) {

                canvas.toBlob(blob => upload(url, blob))
            }else{

                upload(url, dataURLtoBlob(canvas.toDataURL("image/png")))
            }
        } else {
            if (canvas.toBlob) {

                canvas.toBlob(blob => upload(url, blob), "image/jpeg", 0.92)
            }else{

                upload(url, dataURLtoBlob(canvas.toDataURL("image/jpeg", 0.92)))
            }
        }
    }

    function dataURLtoBlob(dataurl) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    function upload(url, blob) {

        const payload = new FormData();
        payload.append('file', blob);
        payload.append('op', 'upload');
        dispatch({type: 'images/uploadImage', url, payload, uid, onUpload})
    }


    return (
        <div>
            {children}
            <div className="chooseFile">
                <input type="file"  onChange={handleUpload}/>
                <span className="hint">{hint}</span>
            </div>
        </div>
    )
};

ImageUploader.propTypes = {
    uid: PropTypes.string.isRequired,
    input: PropTypes.func,
    outputs: PropTypes.array,
    hint: PropTypes.string,
    onUpload: PropTypes.func.isRequired,
};

export default  connect(({images}) => ({images}))(ImageUploader)
