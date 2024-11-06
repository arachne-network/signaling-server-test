### 프로젝트 목적
webrtc를 실시간 영상을 다수의 peer에게 제공하는 사이트입니다.

-------------------
### 실행방법
npm install

npm run start

SyntaxError: Unexpected token '?' 뜨면 npm node install 후 재실행
Docker Redis server 실행방법
```docker run -p 6379:6379 -it redis/redis-stack-server:latest```



-------------------
### 주요 기능
1. streamer 기능: 자신이 방을 만들어 실시간 영상을 송출할 수 있습니다.
2. viewer 기능: streamer의 방에 입장해 실시간으로 영상을 받을 수 있습니다.
3. 방 관리 기능: 서버는 streamer와 그 방송을 보고 있는 viewer의 정보를 저장할 수 있습니다. 이 때, 주기적으로 streamer와 viewer에게 네트워크 상태 데이터를 받습니다.
4. 피어 선택 알고리즘 기능: viewer가 방에 입장할 때, 어떤 peer에게 영상을 받을지 선택할 수 있습니다. 현재는 가장 최근에 들어온 peer랑 연결합니다.


-------------------
## 파일 경로
1. /src/interfaces   
2. /src/Rooms.ts   
현재 생성된 Room List, 추가및 관리에 사용하는 클래스
3. /src/selectPeer.ts   
피어 선택 알고리즘 적용

