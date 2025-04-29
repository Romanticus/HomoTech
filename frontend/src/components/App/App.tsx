import {Layout} from "../Layout/Layout.tsx";
import {Header} from "../Header/Header.tsx";
import {FilmsGallery} from "../FilmsGallery/FilmsGallery.tsx";
import {FilmPreview} from "../FilmPreview/FilmPreview.tsx";
import {Modal} from "../Modal/Modal.tsx";
import {SelectSession} from "../SelectSession/SelectSession.tsx";
import {FilmInfo} from "../FilmInfo/FilmInfo.tsx";
import {ModalHeader} from "../ModalHeader/ModalHeader.tsx";
import {SelectPlaces} from "../SelectPlaces/SelectPlaces.tsx";
import {Basket} from "../Basket/Basket.tsx";
import {ContactsForm} from "../ContactsForm/ContactsForm.tsx";
import {Message} from "../Message/Message.tsx";
import {useAppState} from "../../hooks/useAppState.tsx";


function App() {
    const { state, data, handlers } = useAppState();

    return (<>
        <Layout isLocked={!!state.modal}>
           <Header counter={state.basket.length} onClick={handlers.handleOpenBasket} />
            {data.preview && <FilmPreview {...data.preview} onClick={handlers.handleOpenFilm}  /> }
            <FilmsGallery
                items={state.films}
                selected={state.selectedFilm}
                onClick={handlers.setSelectedFilm}
            />
        </Layout>

        {(state.modal && data.preview) && <Modal
            onClose={handlers.closeModal}
            message={state.message}
            isError={state.isError}
            header={
                (state.modal === 'schedule')
                    ? <FilmInfo {...data.preview} description={data.preview.about} isCompact={true} />
                    : <ModalHeader
                        title={data.preview.title}
                        description={data.preview.about}
                        onClick={handlers.go('prev')}
                    />
            }
            actions={handlers.getAction()}
        >
            {(state.modal === 'schedule') && <SelectSession
                sessions={state.schedule}
                selected={state.selectedSession}
                onSelect={handlers.selectSession}
            />}

            {(state.modal === 'places' && data.session) && <SelectPlaces
                hall={{ rows: data.session.rows, seats: data.session.seats }}
                taken={data.session.taken}
                selected={state.basket}
                onSelect={handlers.selectPlace}
            />}

            {(state.modal === 'basket') && <Basket
                items={data.basket}
                onDelete={handlers.removeTicket}
            />}

            {(state.modal === 'contacts') && <ContactsForm
                value={state.contacts}
                onChange={handlers.setContacts}
            />}

            {(state.modal === 'success') && <Message
                title={'Заказ оформлен'}
                description={'Билеты уже у вас на почте'}
                action={'На главную'}
                onClick={handlers.closeModal}
            />}
        </Modal>}
    </>)
}

export default App
