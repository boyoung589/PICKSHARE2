
## 📓 Project
----
![pickshare](https://user-images.githubusercontent.com/87610758/166643836-bf3c7397-f99c-46bd-bd02-1af8a6f234e1.png)

PICKSHARE이 궁금하시다면, [PICKSHARE 홈페이지](https://www.pickshareapp.com)를 클릭하세요.



## 📓 About
----
- 픽쉐어는 여러 사람들과 함께 일상을 공유할 수 있는 다이어리 서비스입니다.

- 사진 뿐만 아니라 직접 그린 그림을 저장하여 일상을 업로드 할 수 있습니다.

- follow을 통해 사람들과 친구 관계를 맺고 댓글을 달며 소통할 수 있습니다.

- 나만 간직하고픈 일상은 lock 버튼을 통해 보호할 수 있습니다.


## 📓 구현상세
[피그마](https://www.figma.com/file/olOMAF5QBjfDzuPyvAVy5f/Untitled?type=whiteboard&node-id=0%3A1&t=SRg7FoPycSmZkr2M-1)
---
![image](https://github.com/soyoung931014/PICKSHARE/assets/85835359/6f320df1-bc21-4322-9175-6a35e03715d9)



## 📓 Team member
-----
| Role | Name | Position | Github ID | E-mail |
| :----------- | :------------: | :------------: | :------------: | :------------: |
| 팀장 | 박소영 | Fullstack | [soyoung931014](https://github.com/soyoung931014) | soyoung931014@gmail.com |
| 팀원 | 양보영 | Fullstack | [boyoung589](https://github.com/boyoung589) | boyoung589@gmail.com |

# ⚒️ Refactoring

## ✅ 반응형에 대한 구조 
메인 피드의 카드 리스트 부분의 반응형이 깨지는 부분을 발견해서 이를 개선시켰습니다.<br/>
처음 메인 피드리스트 반응형을 구현하려했을떄, 전체 너비 100vw를 기준으로 생각해<br/>
줄어듦에 따라 반응형이 구현되도록 설계했습니다. flex를 주어 반응형을 시도했지만, 너비에 대한 명확한 기준이 없었어서 정렬을 하는데 있어<br/>
`align-items, justify-content center`값만을 줌으로서 정렬을 맞췄고, 결국 카드의 마지막 정렬은 무조건 center가 되기 일수 였습니다. <br/>
어떻게 하면 이를 해결할 수 있을까에 대해 고민했던 찰나 모바일 크기를 디폴트 기준으로 생각하면서 flex로 반응형을 시도해보면 어떨까하는 생각이 들었고, <br/>
팀원과 명확하게 최대 카드 갯수를 정해(4개)생각을 하여 크기가 커짐에 따라 width값을 주고 `flex: 1 0 auto`처리를 해줌으로서 크기를 일정하게 맞춰나갔습니다. <br/>
카드가 2개 이상 들어올때 부터는 `justify-content: flex-start`를 주어 카드의 마지막 정렬을 원하는바대로 구현할 수 있었습니다.<br/>
<img src="https://github.com/soyoung931014/JS-50days/assets/80194405/25b4fe2d-ae91-476b-8f08-c923b4b6f98c" width="300" height="300">

## ✅ 캘린더 구현
이전 프로젝트에서 `<input />` 태그의 내장된 타입 calendar를 사용했었는데, 좀 더 ui적으로 pickshare에 어울리는 캘린더를 구현해보면 
어떨까하는 생각에서 캘린더를 직접 구현헀습니다.
구조는 
```jsx
    <Container>
        <CalHeader/> // 헤더
        <CalDays /> // 일
        <CalCells/> // 달력
    </Container>
```
헤더(2023년 5월)-일자(MON,TUE.., 전달,다음달 아이콘)-달력의 구조로 레이아웃을 나누었습니다. <br/>
핵심이 되는 부분은 달력을 구현하는 부분이었는데, 예를 들어, 5월 달이 30(4월),1,2,3,4...중략..30,31,1(6월),2,3의 모습으로 나온다면, <br/>
해당 달의 시작일(1), 달의 마지막일(31),달의 시작 주의 첫 일(29), 끝 주의 마지막 날(3)을 구해 이차원 배열을 만들어 달력을 구현했습니다. <br/>
5월이 아닌 달을 가지고 있는 날들은(5월인지 아닌지를 비교해) 블러 처리하여 선택하지 못하게 구현했습니다. <br/>
또한 체크된 날은 디폴트로 현재 날로 지정했으며, 체크가 변경될 수 있도록 구현했습니다.  <br/>
![스크린샷 2023-05-14 오전 1 58 57](https://github.com/soyoung931014/JS-50days/assets/80194405/16075af0-a3d6-4502-9914-64996a38fd07)
![스크린샷 2023-05-14 오전 2 48 37](https://github.com/soyoung931014/JS-50days/assets/80194405/68545a1a-6313-41bd-b978-15dcec33d156)

## ✅ 레이아웃 구조짜기
이전 프로젝트에는 대부분의 페이지에 `<nav><body><footer>` 형식으로 구조가 각각 들어가있었습니다.<br/>
따라서 공통의 layout을 만들어줌으로서 이전에 불필요했던 렌더링을 줄였습니다. <br/>
```jsx
   <Container>
      <Header>
        <Nav />
      </Header>
      <Main>
        <Outlet />
      </Main>
      <FooterDiv>
        <Footer />
      </FooterDiv>
    </Container>
```    

## ✅ eslint any타입 최소화, 타입 따로 파일로 관리하기 
픽쉐어 프로젝트를 처음 했을때 타입스크립트 사용이 매우 미흡했었습니다. 따라서 수많은 타입에 any를 주는 경우가 많았습니다.<br/>
개인적으로는 이렇게 많은 부분에 any를 줄 것이었으면 도대체 왜 typesciript를 사용했지? 라는 생각도 들었었습니다.<br/>
이번 리팩토링을 통해 무수한 타입 any를 제거하고 타입을 지정해주어, 맞지 않는 타입의 데이터가 주입되었을 때 데이터베이스에 저장되지 않게 막아 주었습니다.<br />
이 작업을 통해 좀 더 안정적인 소프트웨어로 만들었습니다.<br/>
![과거](https://github.com/soyoung931014/JS-50days/assets/80194405/7dccfc9d-11ba-470f-9d5b-aa7a76310cca) <br />
- any 타입 지정시<br />
<img src="https://github.com/soyoung931014/PICKSHARE/assets/85835359/ec3a0830-3970-4b78-a326-559dd0fa8943" height="100"/>

- 데이터 타입 지정시<br />
<img src="https://github.com/soyoung931014/PICKSHARE/assets/85835359/9cf32b06-e5c1-4319-b7b0-6fb39ab297eb" height="100"/>

## ✅ 무한스크롤 구현하기
모든 피드 데이터를 한번에 받아오는 방식에서, 8개의 피드씩 끊어서 가져오게 구현했습니다.<br />
가져온 중 가장 마지막 피드에 도착하여 ref 지정된 지점에 도달하면 그 이후의 범위를 서버에서 불러오도록<br />
`IntersectionObserver`을 사용하여 구현했습니다.<br/>
이 방식으로 조금씩 덜 무겁게 데이터를 받아올 수 있었습니다. <br />
<img src="https://github.com/soyoung931014/PICKSHARE/assets/85835359/f57b7fbb-c1c7-4c9d-a1a6-294ea1840be7" height="100"/>

  
## 📓 Architecture
----
![스크린샷 2022-07-02 오전 1 46 58](https://user-images.githubusercontent.com/80194405/176936710-21be7f17-3a69-4fb0-b96e-9ba6254c07b0.jpg)  

  
