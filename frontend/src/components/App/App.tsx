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
 
import { AdminAuthForm } from "../AdminAuthForm/AdminAuthForm.tsx";
 
import AdminPanel from "../AdminPanel/AdminPanel.tsx";
import { useAppContext } from "../../contexts/AppContext.tsx";

function App() {
    // const { state, data, handlers } = useAppState();
    const { state,data, handlers } = useAppContext();
    return (<>
        <Layout isLocked={!!state.modal} onOpenAdminPanel={handlers.openAdminPanel}>
           <Header counter={state.basket.length} onClick={handlers.handleOpenBasket} />
            {state.adminIsAuthenticated && <AdminPanel />}
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
                state.modal === 'schedule' && data.preview ? (
                  <FilmInfo {...data.preview} description={data.preview.about} isCompact={true} />
                ) : state.modal === 'admin-auth' ? (
                  <ModalHeader description="Ввведите пароль" title="Админский доступ" onClick={handlers.closeModal} />
                ) : (
                  data.preview && (
                    <ModalHeader
                      title={data.preview.title}
                      description={data.preview.about}
                      onClick={handlers.go('prev')}
                    />
                  )
                )
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
            {(state.modal === 'admin-auth') && (
                <AdminAuthForm 
                  onSubmit={handlers.handleAdminLogin}
                  error ={state.adminError}
                />
  
)}
        </Modal>}
    </>)
}

export default App
