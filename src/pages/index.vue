<script setup lang="ts">
import axiosIns from "@/plugins/axios";
import TableFooter from "@/views/table-footer/TableFooter.vue";
import TableFooterPagination from "@/views/table-footer-pagination/TableFooterPagination.vue";
import type { IApiOrder } from "@/types"

interface IComponentState {
  isFetching: boolean;
  items: IApiOrder[];
  currentPage: number;
  lastFetchedPage: number;
  totalPages: number;
  totalItems: number;
}

const state = ref<IComponentState>({
  isFetching: false,
  items: [],
  currentPage: 1,
  lastFetchedPage: 0,
  totalPages: 0,
  totalItems: 1,
});

const router = useRouter();
const search_query = ref("");
const BASE_URL = import.meta.env.VITE_BASE_URL


const fetchData = async (force = false) => {
  if (
    !force &&
    (state.value.isFetching ||
      state.value.currentPage === state.value.lastFetchedPage)
  ) {
    return;
  }

  try {
    state.value.isFetching = true;
    state.value.items = [];
    const { data } = await axiosIns.get("/api/orders/");
    state.value.items = data;
    state.value.lastFetchedPage = 1;
    state.value.totalPages = 1;
  } catch (error) {
  } finally {
    state.value.isFetching = false;
  }
};

onMounted(() => {
  fetchData();
});

watch(
  () => state.value.currentPage,
  () => fetchData()
);

watch(search_query, (newVal) => {
  if (!newVal) {
    fetchData(true);
  }
});

const handleSearch = () => {
  state.value.currentPage = 1;
  fetchData(true);
};

const onRowClick = (id: number) => {
  console.log(id);

  router.push(`/groups/${id}/`);
};

const resolveInvoiceStatus = (status: IApiOrder['get_status_display']) => {
  const roleMap = {
    Yangi: { color: "info" },           // New → informational
    Pauza: { color: "warning" },        // Paused → warning
    Yuborilgan: { color: "success" },   // Sent → success
    Tayyorlanmoqda: { color: "secondary" }, // Preparing → in-progress
  };

  return roleMap[status] || { color: "default" };
};

</script>

<template>
  <div>
    <VCard>
      <VCardItem>
        <VRow>
          <VSpacer />

          <!-- 👉 Search  -->
          <VCol cols="12" sm="3">
            <VTextField v-model="search_query" @keyup.enter="handleSearch" @blur="handleSearch" placeholder="Qidiruv"
              :rules="[]" density="compact" />
          </VCol>
        </VRow>
      </VCardItem>

      <VDivider />

      <VTable>
        <!-- 👉 Table Head -->
        <thead>
          <tr>
            <th data-column="id">№</th>
            <th>Agent</th>
            <th>Oxirgi muddat</th>
            <th>Holati</th>
          </tr>
        </thead>

        <!-- 👉 Table Body -->
        <tbody>
          <tr v-for="(item, i) in state.items" :key="item.id" @click.stop="onRowClick(item.id)" class="cursor-pointer">
            <td>{{ i + 1 }}</td>
            <td>
             <div class="d-flex align-center py-1 ">
               <img class="agent-img me-2" :src="`${BASE_URL}${item.agent.image}`" alt="">
              <span>{{ item.agent.name }}</span>
             </div>
            </td>
            <td>{{ item.deadline }}</td>
            <td>
              <VChip :color="resolveInvoiceStatus(item.get_status_display).color" density="compact" label
                class="text-uppercase">
                {{ item.get_status_display }}
              </VChip>
            </td>
          </tr>
        </tbody>

        <TableFooter :datas-length="state.items.length" :is-fetching="state.isFetching" />
      </VTable>

      <!-- Pagination -->
      <TableFooterPagination :total-pages="state.totalPages" :items-length="state.items.length"
        :total-items="state.totalItems" v-model:currentPage="state.currentPage" />
    </VCard>
  </div>
</template>

<style lang="scss">
.agent-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}
</style>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
