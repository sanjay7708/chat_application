from django.urls import path
from . views import SendInterestView,RoomListView,IncomeInterestView,ResponseInterestView,RoomDetailView
urlpatterns=[
    path('room_detail/<str:roomname>/',RoomDetailView.as_view(),name='roomdetail'),
    path('income_request/',IncomeInterestView.as_view(),name='incomerequest'),
    path('addFriend/',SendInterestView.as_view(),name='sendInterest'),
    path('roomlist/',RoomListView.as_view(),name='roomlist'),
    path('response_request/',ResponseInterestView.as_view(),name='response_request'),
]