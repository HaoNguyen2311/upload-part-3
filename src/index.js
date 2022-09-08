import React, { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import RangeInput from './RangeInput'
import Cropper from 'react-easy-crop'
import { getRotatedImage, getCroppedImg } from './imageUtils'
import { getOrientation } from 'get-orientation/browser'
import './styles.css'

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
}

const MAX_FILE_SIZE_MB = 10

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

function isFileSizeValid(file) {
  if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
    return false
  }
  return true
}

Modal.setAppElement('#root')
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.75)'

const App = () => {
  const [imageSrc, setImageSrc] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [modalIsOpen, setIsOpen] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )
      console.log('donee', { croppedImage })
      setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [imageSrc, croppedAreaPixels, rotation])

  useEffect(() => {
    if (imageSrc != null) openModal()
  }, [imageSrc])

  const handSliderChange = (e) => {
    setZoom(e.target.value)
  }

  const openModal = () => {
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
  }
  const closeErrorModal = () => {
    setImageError(null)
  }

  const ModalStyles = {
    content: {
      width: '696px',
      maxWidth: '100%',
      height: '590px',
      maxHeight: '100%',
      top: '50%',
      left: '50%',
      position: 'fixed',
      transform: 'translate(-50%, -50%)',
      border: '0',
      borderRadius: '0',
      boxShadow: '0 0 5px rgba(0,0,0,0.5)',
    },
  }
  const ErrorModalStyles = {
    content: {
      width: '696px',
      maxWidth: '100%',
      background: '#ED7000',
      border: '0',
      borderRadius: '0',
      bottom: 'auto',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  }

  const onDelete = useCallback(() => {
    setCroppedImage(null)
    setImageSrc(null)
  }, [])

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (!isFileSizeValid(file)) {
        setImageError({
          message: `File ${file.name} is too big`,
          info: 'The accepted file size is less than 10MB',
        })
        return false
      }

      let imageDataUrl = await readFile(file)

      // apply rotation if needed
      const orientation = await getOrientation(file)
      const rotation = ORIENTATION_TO_ANGLE[orientation]
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      }

      setImageSrc(imageDataUrl)
    }
  }

  return (
    <div className="App">
      <div>
        <Modal
          isOpen={imageError}
          onRequestClose={closeErrorModal}
          style={ErrorModalStyles}
          contentLabel="Error Modal"
        >
          <button
            className="modal-close modal-close--error"
            onClick={closeErrorModal}
          >
            <span className="sr-only">close</span>
          </button>

          <div>
            <h3>{imageError ? imageError.message : ''}</h3>
            <p>{imageError ? imageError.info : ''}</p>
          </div>
        </Modal>

        <Modal
          isOpen={modalIsOpen && !croppedImage && imageSrc}
          onRequestClose={closeModal}
          style={ModalStyles}
          contentLabel="Cropping Modal"
        >
          <div className="modal-header">
            <h2>Crop Photo</h2>
            <button className="modal-close" onClick={closeModal}>
              <span className="sr-only">close</span>
            </button>
          </div>
          <div className="crop-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              cropShape="round"
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="drag-message">Drag to reposition photo</div>
          <div className="controls">
            <label for="range-slider">Zoom</label>
            <RangeInput
              id="range-slider"
              min={1}
              max={2}
              step={0.025}
              value={zoom}
              onChange={handSliderChange}
            />
            <button className="apply-crop" onClick={showCroppedImage}>
              Apply
            </button>
          </div>
        </Modal>

        {croppedImage ? (
          <div className="cropped-image-wrapper">
            <img src={croppedImage} alt="Your Profile" />
            <button onClick={onDelete}>
              <span className="sr-only">Delete</span>
            </button>
          </div>
        ) : (
          <div className="upload-state">
            <label className="upload">
              <span className="upload__label">
                <span className="sr-only">Upload an Image</span>
              </span>
              <input
                className="upload__input"
                type="file"
                onChange={onFileChange}
                accept="image/*"
              />
            </label>
          </div>
        )}
        <div className="lorem-block">
          <h2>Display Name</h2>
          <p>Lorem ipsum</p>
        </div>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
