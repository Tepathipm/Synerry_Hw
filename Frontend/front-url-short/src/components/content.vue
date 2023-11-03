<script setup>
import { onBeforeMount, reactive, ref} from 'vue';
import Qrcodevue from 'qrcode.vue'
import deleteIcon from './icons/AntDesignDeleteFilled.vue'
const fetchback = import.meta.env.VITE_ROOT_API
const url = ref('')
const showAllUrl = reactive([])
const showShortUrl = ref('')
const showLongUrl = ref('')

onBeforeMount( async() => {
  await getAllUrl()
})

const sendUrl = async()=>{
  try{
    const res = await fetch(`${fetchback}/shorturl`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        longUrl:url.value
      })
    })
    if(res.ok){
      showAllUrl.length = 0;
      console.log('ok')
      const data = await res.json()
      for(let i of data){
      showShortUrl.value = i.shortUrl
      showLongUrl.value = i.longUrl
      }
      getAllUrl()
      url.value = ''
    }
    if(res.status===400){
      const errMsg = await res.json()
      alert(errMsg.error)
      url.value = ''
    }
  } catch(err){
    alert(err)
  }
}

const getAllUrl = async()=>{
  try{
    const res = await fetch(`${fetchback}/shorturl`,{
      headers:{
        'Content-Type': 'application/json'
      }
    })
    if(res.ok){
      const data = await res.json();
      showAllUrl.push(...data)
    }
    if(res.status === 400){
      const errMsg = await res.json
      alert(errMsg.error)
    }
  } catch(err){
    alert(err)
  }
}

const toRedirect = async (url) => {
  try {
    const res = await fetch( `${url}`,{
      headers:{
        'Content-Type': 'application/json',
      }
    });
    if (res.ok) {
      document.location.reload()
      } 
  } catch (err) {
    console.error('Error:', err);
  }
};




const deleteUrl = async (x) => {
  let msg = 'You want to delete this URL?'
  if(confirm(msg) === true)
  try {
    const res = await fetch(x, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      const data = await res.json()
      alert(data.message)
      document.location.reload();
    }
    if (res.status === 400) {
      const errMsg = await res.json();
      alert(errMsg.error);
    }
  } catch (err) {
    alert(err);
  }
}

</script>

<template>
  <div class="w-screen h-screen relative bg-black">
    <div class="header absolute flex flex-col w-full mt-7 items-start justify-start space-y-10">
      <div class="title font-semibold text-8xl text-center text-white">Make Your <span class="text-[#24e78f]">Short</span></div>
      <div class="content flex flex-row items-center justify-center h-full">
        <input type="text" class="inputUrl w-full border rounded" v-model="url" placeholder="Enter URL">
        <button class="btn font-semibold rounded text-[#24BB78] bg-[#1C191C] hover:bg-[#24BB78] hover:text-black duration-500 h-[7%]" @click="sendUrl">Send URL</button>
      </div>
      <div class="showShort text-white">shorted URL : 
        <a :href="showShortUrl" target="_self" @click="toRedirect(showShortUrl)" class="text-[#24e78f]">{{ showShortUrl }}</a></div>
    </div>
    <div class="qrCode absolute flex flex-col items-center justify-center h-1/2 w-1/4">
      <div v-if="showShortUrl"><Qrcodevue :value="showLongUrl" :size="200" :level="H"></Qrcodevue></div>
    </div>
    <div class="tableToShow absolute w-full overflow-auto text-white text-center">
      <table class="table-auto h-full w-full">
        <thead>
          <tr class="rounded-2xl h-14">
            <th class="border ">NO.</th>
            <th class="border">SHORTURL</th>
            <th class="border">NUMBER OF CLICKS</th>
            <th class="border">QR CODE</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="">
          <tr class="text-white text-center " v-for="(items, index) in showAllUrl" :key="items._id" >
            <td class="border border-white">{{ index + 1 }}</td>
            <td class="border border-white"><a :href="items.shortUrl" target="_blank" @click="toRedirect(items.shortUrl)">{{ items.shortUrl }}</a></td>
            <td class="border ">{{ items.numOfClick }}</td>
            <td class="border flex justify-center items-center h-full p-1"><Qrcodevue :value="items.longUrl" :size="100" :level="H"></Qrcodevue></td>
            <td class=""><button class="" @click="deleteUrl(items.shortUrl)"><deleteIcon class="Icon"/></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

html{
  scroll-behavior: smooth;
}

td{
  color: #24e78f;
}
.header {
  margin: 0 auto;
  padding: 3rem;
  height: 45%;
}
.tableToShow {
  margin: 0 auto;
  padding: 3rem;
  bottom: 0;
  height: 55%;
}
.content{
  width: 65%;
}
.inputUrl{
  height: 30%;
}
.btn{
  width: 6rem;
  height: 30%;
}

.qrCode{
  right: 4%;
}

.Icon{
  transition: .7s;
}

.Icon:hover{
  animation: up 1.85s infinite;
  transition: .7s;
  opacity: 50%;
}

@keyframes up {
  0% {
    transform: translate(0, 0) ;

  }
  50% {
    transform: translate(0, -20px) rotate(180deg);

  }
    100% {
    transform: translate(0, 0) rotate(180deg);

  }
}
</style>
