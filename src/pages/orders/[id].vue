<script lang="ts" setup>
import { transformImageUrl } from "@/helpers";
import axios from "@/plugins/axios";
import { IApiOrder, IApiOrderItem } from "@/types";
import Loader from "@/views/loader/index.vue";

const route = useRoute();

const state = ref<{
  item: IApiOrder;
  isFetching: boolean;
  isItemFetching: boolean;
}>({
  item: {
    id: 0,
    agent: {
      id: 0,
      name: "",
      address: "",
      image: "",
    },
    deadline: "",
    status: 1,
    get_status_display: "Yangi",
    items: [
      {
        id: 0,
        product: {
          id: 0,
          name: "",
          measure: "",
        },
        count: 0,
        box_count: "",
        status: 0,
        get_status_display: "Tayyor",
      },
    ],
    created_date: "",
    sent_date: "",
    total_count: 0,
    percentage: 0,
    created_date_: "",
  },
  isFetching: true,
  isItemFetching: false,
});

onMounted(async () => {
  try {
    state.value.isFetching = true;

    const response = await axios.get<IApiOrder>(
      `/api/orders/${route.params.id}/`
    );
    state.value.item = response.data;
  } finally {
    state.value.isFetching = false;
  }
});

const orderStatusColor = computed(() => {
  const roleMap = {
    Yangi: "warning", 
    Pauza: "secondary", 
    Yuborilgan: "success", 
    Tayyorlanmoqda: "ingo", 
  };

  return roleMap[state.value.item.get_status_display] || "default";
});

const deadlineColor = computed(() => {
  if (state.value.item.created_date_ && state.value.item.deadline) {
    const startDate = new Date(state.value.item.created_date_);
    const deadlineDate = new Date(state.value.item.deadline);
    const today = new Date();

    const totalDays = Math.ceil(
      (deadlineDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const spentDays = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const leftDays = totalDays - spentDays;

    // If deadline passed → red
    if (leftDays < 0) {
      return "error";
    }

    // If more than half time is spent → warning
    if (spentDays >= totalDays / 2) {
      return "warning";
    }

    // Otherwise far from deadline → primary
    return "primary";
  }

  return "secondary";
});

const status = computed(() => ({
  Yangi: state.value.item.get_status_display === "Yangi",
  Pauza: state.value.item.get_status_display === "Pauza",
  Yuborilgan: state.value.item.get_status_display === "Yuborilgan",
  Tayyorlanmoqda: state.value.item.get_status_display === "Tayyorlanmoqda",
}));

const resolveStatusColor = (status: IApiOrderItem["get_status_display"]) => {
  const roleMap = {
    Tayyorlanmoqda: "info",
    Tayyor: "success",
  };

  return roleMap[status] || "default";
};

const changeOrderStatus = (status: number) => {
  const item = state.value.item;
  switch (status) {
    case 2:
      axios.put(`/api/orders/${item.id}/`, {
        created_date: new Date(item.created_date).toISOString().split("T")[0],
        items: item.items.map((el) => ({ ...el, product: el.product.id })),
      });
      break;

    default:
      break;
  }
};

const changeOrderItemStatus = async (
  id: number,
  product_id: number,
  count: number,
  status: number
) => {
  try {
    state.value.isItemFetching = true;
    const response = await axios.put<IApiOrderItem>(`/api/order_items/${id}/`, {
      product: product_id,
      count,
      status,
    });

    state.value.item.items = state.value.item.items.map((el) => {
      if (el.id == id) {
        return response.data;
      }
      return el;
    });
  } finally {
    state.value.isItemFetching = false;
  }
};

const isEveryItemHasReadyStatus = computed(() =>
  state.value.item.items.every((el) => el.status === 2)
);
</script>

<template>
  <Loader v-if="state.isFetching" />
  <VRow v-else>
    <VCol cols="12" md="5" lg="4">
      <VCard>
        <VCardText class="text-center pt-15">
          <VAvatar rounded :size="120" color="primary" variant="tonal">
            <VImg
              v-if="true"
              cover
              :src="transformImageUrl(state.item.agent.image)"
            />
            <span v-else class="text-5xl font-weight-semibold">
              {{ "avatarText(props.userData.fullName)" }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h6 mt-3">
            {{ state.item.agent.name }}
          </h6>

          <!-- 👉 Agent chip -->
          <VChip label color="primary" density="compact" class="mt-2">
            Agent
          </VChip>
        </VCardText>

        <VCardText>
          <VDivider class="my-4" />
          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <span class="font-weight-medium me-1">Manzil:</span>
                <span class="text-body-1 text-medium-emphasis">
                  {{ state.item.agent.address }}
                </span>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="7" lg="8" class="">
      <VCard class="d-flex">
        <VCardItem class="pa-3">
          <VChip
            :color="orderStatusColor"
            size="large"
            density="compact"
            label
            class="text-uppercase font-weight-bold"
          >
            {{ state.item.get_status_display }}
          </VChip>
        </VCardItem>
        <VCardText class="pa-3 d-flex align-center gap-4">
          <VChip
            color="success"
            v-if="status.Yuborilgan"
            size="large"
            density="compact"
            label
            class="text-uppercase font-weight-bold"
          >
            <VTooltip activator="parent" location="bottom"
              >Yuborilgan sana
            </VTooltip>
            {{ state.item.sent_date }}
          </VChip>
          <VChip
            :color="deadlineColor"
            v-else
            size="large"
            density="compact"
            label
            class="text-uppercase font-weight-bold"
          >
            <VTooltip activator="parent" location="bottom">Muddat </VTooltip>
            {{ state.item.deadline }}
          </VChip>

          <span>
            <span class="font-weight-bold">Boshlanish sanasi: </span>
            <span>{{ state.item.created_date_ }}</span>
          </span>
        </VCardText>
        <VSpacer />
        <VCardText class="pa-3 d-flex gap-2 justify-end">
          <VBtn
            color="secondary"
            v-if="status.Tayyorlanmoqda && !status.Yuborilgan"
            >Pauza</VBtn
          >
          <VBtn color="info" v-if="status.Pauza && !status.Yuborilgan"
            >Davom Ettirish</VBtn
          >
          <VBtn
            color="info"
            :disabled="status.Pauza || status.Yuborilgan"
            @click="changeOrderStatus(2)"
            >Tayyorlash</VBtn
          >
        </VCardText>
      </VCard>
      <VCard class="mt-5">
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col" class="border-0">Mahsulot</th>
              <th scope="col" class="border-0">Holati</th>
              <th scope="col" class="border-0">Soni</th>
              <th scope="col" class="border-0">Soni (quti)</th>
              <th
                data-column="actions"
                scope="col"
                v-if="!isEveryItemHasReadyStatus"
              >
                Amallar
              </th>
            </tr>
            <tr class="position-relative">
              <v-progress-linear
                :indeterminate="state.isItemFetching"
                color="blue"
                absolute
                bottom
                height="2"
              />
            </tr>
          </thead>

          <tbody>
            <tr v-for="elem in state.item.items" :key="elem.id">
              <td>{{ elem.product.name }}</td>
              <td
                :class="`text-${resolveStatusColor(elem.get_status_display)}`"
              >
                {{ elem.get_status_display || "Kutmoqda" }}
              </td>
              <td>{{ +elem.count }}</td>
              <td>{{ +elem.box_count }}</td>
              <td data-column="actions" v-if="!isEveryItemHasReadyStatus">
                <VTooltip location="bottom" v-if="elem.status === 0">
                  <template v-slot:activator="{ props: activatorProps }">
                    <VIcon
                      v-bind="activatorProps"
                      @click.stop="
                        changeOrderItemStatus(
                          elem.id,
                          elem.product.id,
                          elem.count,
                          1
                        )
                      "
                      size="30"
                      icon="mdi-sync"
                      color="info"
                      class="mx-2"
                    />
                  </template>
                  Tayyorlash
                </VTooltip>

                <VTooltip location="bottom" v-if="elem.status === 1">
                  <template v-slot:activator="{ props: activatorProps }">
                    <VIcon
                      v-bind="activatorProps"
                      @click.stop="
                        changeOrderItemStatus(
                          elem.id,
                          elem.product.id,
                          elem.count,
                          2
                        )
                      "
                      size="30"
                      icon="mdi-check-bold"
                      color="success"
                      class="mx-2"
                    />
                  </template>
                  Tayyor
                </VTooltip>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
    <!-- <VCol cols="12" md="7" lg="8" class="">
        </VCol> -->
  </VRow>
</template>

<style scoped lang="scss"></style>
