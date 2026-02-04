import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonLoading,
  IonCard,
  IonCardContent,
  IonBadge,
  IonText,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import axios from 'axios';
import './Home.css';

// Definición de interfaces TypeScript
interface Character {
  id: number;
  name: string;
  gender: string;
  status: string;
  species: string;
  createdAt: string;
  image: string;
}

interface ApiResponse {
  items: Character[];
}

const Home: React.FC = () => {
  // Estados del componente
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const API_URL = 'https://futuramaapi.com/api/characters?orderBy=id&orderByDirection=asc&page=1&size=50';

  // Función para obtener los personajes
  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get<ApiResponse>(API_URL);
      
      if (response.data && response.data.items) {
        setCharacters(response.data.items);
      } else {
        setCharacters([]);
      }
    } catch (err) {
      console.error('Error al obtener personajes:', err);
      setError('No se pudieron cargar los personajes. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar personajes 
  useEffect(() => {
    fetchCharacters();
  }, []);

  //Recargar los datos
  const handleRefresh = async (event: CustomEvent) => {
    await fetchCharacters();
    event.detail.complete();
  };

const translateGender = (gender: string): string => {
    switch (gender) {
      case 'MALE':
        return 'Hombre';
      case 'FEMALE':
        return 'Mujer';
      default:
        return 'Desconocido';
    }
  };

const translateStatus = (status: string): string => {
  switch (status) {
    case 'LIVE':
      return 'Vivo';
    case 'DEAD':
      return 'Muerto';
    default:
      return 'Desconocido';
  }
};

return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Personajes</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Personajes de Futurama</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Componente de refresh */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* spinner */}
        <IonLoading
          isOpen={loading}
          message="Cargando personajes..."
        />

        {/* Mensaje de error */}
        {error && !loading && (
          <IonCard color="danger">
            <IonCardContent>
              <IonText color="light">
                <h2>Error</h2>
                <p>{error}</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* Lista vacía */}
        {!loading && !error && characters.length === 0 && (
          <IonCard>
            <IonCardContent>
              <IonText color="medium">
                <h2>No hay personajes disponibles</h2>
                <p>No se encontraron personajes en este momento.</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* Lista de personajes */}
        {!loading && !error && characters.length > 0 && (
          <IonList>
            {characters.map((character) => (
              <IonItem key={character.id}>
                <IonAvatar slot="start">
                  <img 
                    src={character.image} 
                    alt={character.name}
                    onError={(e) => {
                      // EN caso de fallo de imagen
                      (e.target as HTMLImageElement).src = 'https://ionicframework.com/docs/img/demos/avatar.svg';
                    }}
                  />
                </IonAvatar>
                
                <IonLabel>
                  <h2>
                    <strong>{character.name}</strong>
                  </h2>
                  <p>
                    <IonText color="medium">
                      Género: {translateGender(character.gender)}
                    </IonText>
                  </p>
                  <p>
                    <IonBadge color={(character.status)}>
                      Estado: {translateStatus(character.status)}
                    </IonBadge>
                  </p>
                  <p>
                    <IonText color="medium" style={{ fontSize: '0.8em' }}>
                      Especie: {character.species}
                    </IonText>
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;