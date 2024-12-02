import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

const SOCKET_URL = 'http://localhost:80/ws'

let stompClient = null

export const connectWebSocket = (onMessageReceived, userId) => {
  const socket = new SockJS(SOCKET_URL)
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000, // 재연결 딜레이 (ms)
    onConnect: () => {
      console.log('WebSocket connected!')

      // /topic/notifications/{userId} 구독
      stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
        if (onMessageReceived) {
          onMessageReceived(message)
        }
      })
    },
    onStompError: (error) => {
      console.error('STOMP Error:', error)
    },
  })

  stompClient.activate()
}

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate()
    console.log('WebSocket disconnected!')
  }
}
