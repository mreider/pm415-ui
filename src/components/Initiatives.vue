<template>
  <v-container fluid>
    <div v-if="loading === true">
      <loading-indication></loading-indication>
    </div>
    <v-layout row wrap>
      <v-toolbar card prominent align-center class="cards-toolbar hidden-sm-and-down">
        <v-checkbox label="Show archived" class="checkbox" v-model="showArchived" @change="reload"></v-checkbox>
        <div>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('initiative')"
            :class="{'v-btn--active': this.activatedButton === 'initiative' }"
          >Initiative</v-btn>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('popularity')"
            :class="{'v-btn--active': this.activatedButton === 'popularity' }"
          >Popularity</v-btn>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('importance')"
            :class="{'v-btn--active': this.activatedButton === 'importance' }"
          >Importance</v-btn>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('horizon')"
            :class="{'v-btn--active': this.activatedButton === 'horizon' }"
          >horizon</v-btn>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('author')"
            :class="{'v-btn--active': this.activatedButton === 'author' }"
          >Author</v-btn>
        </div>
        <v-spacer class="hidden-md-and-down"></v-spacer>
        <v-btn small outline color="success" @click="dialogNewInitiative = true">New</v-btn>
      </v-toolbar>
      <v-toolbar card prominent align-center class="cards-toolbar hidden-sm-and-down">
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field
          label="Filter"
          v-model="filter"
          single-line
          class="pt-0"
          @keyup="filterInitiatives"
        ></v-text-field>
        <v-btn
          small
          outline
          class="pt-0 mt-0 clear-filter-botton"
          @click="filter = '', clearInitiativesFilter()"
        >Clear</v-btn>
      </v-toolbar>
      <!--toolbar for mobile sizes-->
      <v-layout row wrap justify-center>
        <v-flex xs12 pl-3 pr-3 class="cards-toolbar-mobile hidden-md-and-up">
          <v-btn small outline color="success" @click="dialogNewInitiative = true">New</v-btn>
          <v-checkbox
            label="Show archived"
            class="checkbox pl-2 pr-2"
            v-model="showArchived"
            @change="reload"
          ></v-checkbox>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('initiative')"
            :class="{'v-btn--active': this.activatedButton === 'initiative' }"
          >Initiative</v-btn>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('popularity')"
            :class="{'v-btn--active': this.activatedButton === 'popularity' }"
          >Popularity</v-btn>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('importance')"
            :class="{'v-btn--active': this.activatedButton === 'importance' }"
          >Importance</v-btn>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('horizon')"
            :class="{'v-btn--active': this.activatedButton === 'horizon' }"
          >horizon</v-btn>
          <v-btn
            small
            color="primary"
            outline
            @click="sortInitiaiveCards('author')"
            :class="{'v-btn--active': this.activatedButton === 'author' }"
          >Author</v-btn>
        </v-flex>

        <v-flex xs12 pl-3 pr-3 class="cards-toolbar-mobile hidden-md-and-up">
          <v-text-field
            label="Filter"
            @keyup="filterInitiatives"
            single-line
            class="pt-0 pl-2 pr-2"
            v-model="filter"
          ></v-text-field>
          <v-btn
            small
            outline
            class="pt-0 mt-0 clear-filter-botton"
            @click="filter = '', clearInitiativesFilter()"
          >Clear</v-btn>
        </v-flex>
      </v-layout>
      <!--cards section-->

      <draggable
        :list="intiativeCards"
        @start="draging=true"
        @end="onEnd($event)"
        @change="onListChange"
        :move="onMove"
        class="layout wrap"
      >
        <v-flex xs12 sm6 md4 lg3 pl-1 pr-1 pt-3 v-for="item in intiativeCards" :key="item.id">
          <v-card>
            <v-card-title primary-title>
              <h4 class="mb-0">
                Initiative:
                <router-link
                  :to="'initiative/?orgId='+$store.state.organization.id +'&initiativeid='+ item.id"
                >{{ item.title }}</router-link>
              </h4>
            </v-card-title>
            <div class="card-body pt-0 pb-0">
              <p class="mb-2">Description: {{item.description}}</p>
              <p class="mb-2">Popularity: {{item.popularity}}</p>
              <p class="mb-2">
                importance:
                <a
                  href="#"
                  @click="filterInitiatives(item.importance)"
                >{{item.importance}}</a>
              </p>
              <p class="mb-2">
                Horizon:
                <a
                  href="#"
                  @click="filterInitiatives(item.horizon.horizon)"
                >{{item.horizon.horizon}}</a>
              </p>
              <p class="mb-2">
                Author:
                <a
                  href="#"
                  @click="filterInitiatives(item.lastName)"
                >{{item.firstName + ' ' + item.lastName }}</a>
              </p>
            </div>

            <v-card-actions class="pl-3 pb-2">
              <v-btn
                slot="activator"
                class="edit-button extra-small-button"
                outline
                fab
                dark
                small
                color="primary"
                :to="'initiative/?orgId='+$store.state.organization.id +'&initiativeid='+ item.id"
              >
                <i class="material-icons">edit</i>
              </v-btn>
              <v-btn
                v-if="$store.state.user.id ===  item.createdBy || admin"
                class="delete-button extra-small-button"
                outline
                fab
                dark
                small
                color="primary"
                @click="setCurrentInitiative(item), dialogDeleteInitiative = true"
              >
                <i class="material-icons">delete</i>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </draggable>
    </v-layout>
    <v-layout row wrap justify-center>
      <div class="text-xs-center pt-3">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="15"
          @input="paginationFunction"
          v-if="initialInitiatives.length"
        ></v-pagination>
      </div>
    </v-layout>

    <v-dialog v-model="dialogNewInitiative" max-width="850px">
      <v-card>
        <v-card-title>
          <span class="headline">New initiative</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm7>
                <v-text-field v-model="newInitiative.title" placeholder="Enter initiative"></v-text-field>
                <v-textarea v-model="newInitiative.description" placeholder="Enter hightlights"></v-textarea>
              </v-flex>
              <v-flex xs12 sm5>
                <v-layout row wrap align-center>
                  <v-flex xs4 mt-1>
                    <v-subheader>Vote</v-subheader>
                  </v-flex>
                  <v-flex xs8 mt-1>
                    <v-btn
                      flat
                      icon
                      color="blue-grey darken-3"
                      :class="{'v-btn--active': this.btntrue === 'voteUp' }"
                      @click="handleNewInitiativeSetField(true, 'vote')"
                    >
                      <v-icon>thumb_up</v-icon>
                    </v-btn>
                    <v-btn
                      flat
                      icon
                      color="blue-grey darken-3"
                      :class="{'v-btn--active': this.btnfalse === 'voteDown' }"
                      @click="handleNewInitiativeSetField(false, 'vote')"
                    >
                      <v-icon>thumb_down</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-subheader>Horizon</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      :items="horizonList"
                      item-text="horizon"
                      item-value="horizon"
                      return-object
                      @input="handleNewInitiativeSetField($event, 'horizon')"
                    ></v-select>
                  </v-flex>
                  <v-flex xs4>
                    <v-subheader>Priority</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      :items="objStatuses"
                      item-text="name"
                      item-value="name"
                      return-object
                      @change="handleNewInitiativeSetField($event, 'status')"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-layout row wrap>
            <v-flex xs-12>
              <v-btn
                color="blue darken-1"
                class="save-and-close-button"
                flat
                medium
                @click="handleNewInitiative(false)"
              >Save and close</v-btn>
              <v-btn
                color="blue darken-1"
                flat
                medium
                @click="handleNewInitiative(true)"
              >Save and open</v-btn>
              <v-btn color="blue darken-1" flat medium @click="dialogNewInitiative=false">Cancel</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDeleteInitiative" max-width="250">
      <v-card>
        <v-card-text
          class="text-xs-center subheading"
        >Wait. Are you sure you want to delete this permanently?</v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            flat="flat"
            outline
            @click="dialogDeleteInitiative = false"
            small
          >Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            flat="flat"
            outline
            @click="handleInitiativeDelete(currentInitiative)"
            small
          >Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import _get from "lodash/get";
import _ from "lodash";
import { username } from "@/utils";
import draggable from "vuedraggable";
export default {
  name: "Initiatives",
  data() {
    return {
      activatedButton: "",
      initialInitiatives: [],
      initiatives: [],
      initialInitiativesForSorting: [],
      initialFilteredInitiatives: null,
      filteredInitiatives: null,
      filter: null,
      objStatuses: [],
      page: 1,
      currentPage: 0,
      totalPages: 4,
      perPage: 8,
      sliceFrom: 0,
      newInitiative: {
        title: "",
        description: "",
        status: { id: 10, name: "Should have" },
        horizon: { date: new Date(), horizon: this.getHorizonName(new Date()) },
        vote: null
      },
      horizonList: [],
      vote: "",
      btntrue: "",
      btnfalse: "",
      show: false,
      currentInitiative: "",
      admin: false,
      showArchived: false,
      dialogNewInitiative: false,
      dialogDeleteInitiative: false,
      loading: false,
      paramForNewCard: null,
      dragging: false,
      draggedContext: {},
      relatedContext: {}
    };
  },

  computed: {
    intiativeCards: function() {
      return this.filteredInitiatives !== null
        ? this.filteredInitiatives.slice(0, this.perPage)
        : this.initiatives;
    }
  },
  watch: {},
  async mounted() {
    await this.loadOrgStatuses();
    await this.loadOrgInitiatives();
    this.horizonLoadList();
  },
  methods: {
    close() {
      this.dialogNewInitiative = false;
    },
    async reload(checked) {
      this.showArchived = checked;
      await this.loadOrgInitiatives();
    },
    setCurrentInitiative(element) {
      this.currentInitiative = element;
    },
    handleCloseNew() {
      this.$refs.modalnew.hide();
    },
    horizonLoadList() {
      let newDate = new Date();
      let obj = {
        date: newDate,
        horizon: this.getHorizonName(newDate)
      };
      this.horizonList.push(obj);

      newDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
      obj = {
        date: newDate,
        horizon: this.getHorizonName(newDate)
      };
      this.horizonList.push(obj);

      newDate = new Date(new Date().setMonth(new Date().getMonth() + 6));
      obj = {
        date: newDate,
        horizon: this.getHorizonName(newDate)
      };
      this.horizonList.push(obj);

      newDate = new Date(new Date().setMonth(new Date().getMonth() + 9));
      obj = {
        date: newDate,
        horizon: this.getHorizonName(newDate)
      };
      this.horizonList.push(obj);

      newDate = new Date(new Date().setMonth(new Date().getMonth() + 12));
      obj = {
        date: newDate,
        horizon: this.getHorizonName(newDate)
      };
      this.horizonList.push(obj);

      newDate = new Date(new Date().setMonth(new Date().getMonth() + 15));
      obj = {
        date: newDate,
        horizon: this.getHorizonName(newDate)
      };
      this.horizonList.push(obj);
    },
    async loadOrgInitiatives() {
      try {
        const response = await this.axios.get(
          `/api/initiatives/all/${this.showArchived}/${
            this.$store.state.organization.id
          }`
        );

        const success = _get(response, "data.success");
        if (!success) throw new Error(`Unable to load initiatives.`);

        const initiatives = _get(response, "data.initiatives");
        initiatives.forEach(element => {
          element.author = username(element);
          element.importance = _.find(this.objStatuses, {
            id: element.statusId
          }).name;
          element.horizon = {
            date: element.horizon,
            horizon: this.getHorizonName(new Date(element.horizon))
          };
        });
        initiatives.sort((a, b) => {
          if (b.order_index > a.order_index) {
            return 1;
          }
          if (b.order_index < a.order_index) {
            return -1;
          }
          return 0;
        });
        this.totalPages = Math.ceil(initiatives.length / this.perPage);

        this.initialInitiatives = initiatives;
        this.initialInitiativesForSorting = initiatives.slice();
        this.initiatives = this.initialInitiatives.slice(0, this.perPage);

        this.admin = _get(response, "data.admin");
        this.paginationFunction(this.page > this.totalPages ? 1 : this.page);
      } catch (error) {
        this.loading = false;
        return this.$errorMessage.show(error);
      } finally {
        this.loading = false;
      }
    },
    async handleInitiativeDelete(initiative) {
      this.loading = true;
      if (!initiative || !this.$store.state.user.id) {
        // return this.$notify({group: 'error', type: 'err', text: 'Empty new organization name field'});
      }
      try {
        let response = await this.axios.delete(
          `/api/initiatives/${this.$store.state.organization.id}/${
            initiative.id
          }`
        );
        let success = _get(response, "data.success");
        this.loading = false;
        if (!success) throw new Error(`Unable delete initiative.`);
      } catch (error) {
        return this.$errorMessage.show(error);
      } finally {
        this.loadOrgInitiatives();
        this.$notify({
          group: "app",
          type: "success",
          text: `Item ${initiative.title} was deleted`
        });
        this.currentInitiative = "";
        this.dialogDeleteInitiative = false;
      }
    },
    async loadOrgStatuses() {
      this.loading = true;
      try {
        const orgId = this.$store.state.organization.id;

        const response = await this.axios.get(
          `/api/statuses/initiatives/${orgId}`
        );

        const success = _get(response, "data.success");
        if (!success) throw new Error(`Unable to load user's organizations.`);

        this.objStatuses = _get(response, "data.statuses");
      } catch (error) {
        this.loading = false;
        return this.$errorMessage.show(error);
      } finally {
      }
    },
    async handleNewInitiative(go) {
      this.loading = true;
      try {
        let data = {};
        data.statusId = String(this.newInitiative.status.id);
        data.description = this.newInitiative.description;
        data.title = this.newInitiative.title;
        data.horizon = this.formatDate(this.newInitiative.horizon.date);
        const response = await this.axios.post(
          `/api/initiatives/new/${this.$store.state.organization.id}`,
          data
        );
        const success = _get(response, "data.success");
        if (success) {
          const createdInitiative = _get(response, "data.initiative");
          if (this.vote !== "") this.doVote(this.vote, createdInitiative.id);
          if (go === true) {
            this.$router.push({
              name: "Initiative",
              query: {
                orgId: this.$store.state.organization.id,
                initiativeid: createdInitiative.id
              }
            });
          }
          this.dialogNewInitiative = false;
        }
        if (!success) throw new Error(`Unable to create new initiative.`);
      } catch (error) {
        this.loading = false;
        return this.$errorMessage.show(error);
      } finally {
        this.loading = false;
        this.newInitiative = {
          title: "",
          description: "",
          status: { id: 12, name: "Won't have" },
          horizon: {
            date: new Date(),
            horizon: this.getHorizonName(new Date())
          },
          vote: null
        };
        this.vote = "";
        this.btntrue = "";
        this.btnfalse = "";
        this.show = false;
        this.loadOrgInitiatives();
      }
    },
    setParameterForNewCard(newParam) {
      this.paramForNewCard = newParam;
    },
    handleNewInitiativeSetField(element, name) {
      if (element.hasOwnProperty("horizon")) {
        name = "horizon";
      }
      if (element.hasOwnProperty("name")) {
        name = "status";
      }
      this.newInitiative[name] = element;
      if (name === "vote") {
        this.vote = element;
        if (element === true) {
          this.btntrue = "voteUp";
          this.btnfalse = "";
        } else {
          this.btntrue = "";
          this.btnfalse = "voteDown";
        }
      }
    },
    async doVote(result, initiativeId) {
      try {
        const response = await this.axios.post(
          `/api/votes/initiatives/` + initiativeId + "/" + String(result)
        );

        const success = _get(response, "data.success");
        if (!success) throw new Error(`Unable to vote.`);
      } catch (error) {
        return this.$errorMessage.show(error);
      } finally {
      }
    },
    getHorizonName(d) {
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      let quarter = 0;
      if (month < 3) {
        quarter = 1;
      } else if (month < 6) {
        quarter = 2;
      } else if (month < 9) {
        quarter = 3;
      } else if (month < 12) {
        quarter = 4;
      }
      return "Q" + quarter + year;
    },
    formatDate(d) {
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const day = d.getDate();
      return year + "-" + month + "-" + day;
    },
    sortInitiaiveCards(initiativeName) {
      let param = initiativeName.toLowerCase();
      function sortFunction(a, b) {
        if (param === "initiative") {
          param = "title";
        }
        let aParam;
        let bParam;
        if (param === "horizon") {
          aParam = a[param][param].replace(/\s/g, "X").toLowerCase();
          bParam = b[param][param].replace(/\s/g, "X").toLowerCase();
          if (aParam > bParam) {
            return -1;
          }
          if (aParam === bParam) {
            return 1;
          }
          return 0;
        } else {
          aParam =
            typeof a[param] === "string"
              ? a[param].replace(/\s/g, "X").toLowerCase()
              : a[param];
          bParam =
            typeof b[param] === "string"
              ? b[param].replace(/\s/g, "X").toLowerCase()
              : b[param];
          if (param === "popularity") {
            if (aParam > bParam) {
              return -1;
            }
            if (aParam === bParam) {
              return 1;
            }
          } else {
            if (aParam < bParam) {
              return -1;
            }
            if (aParam === bParam) {
              return 1;
            }
          }

          return 0;
        }
      }

      if (this.activatedButton !== initiativeName) {
        // Check if initiatives was filtered by filter input, if true, sorting filtered initiatives
        if (this.filteredInitiatives !== null) {
          let sortedFilteredInitiatives = this.initialFilteredInitiatives.slice();
          this.filteredInitiatives = sortedFilteredInitiatives
            .sort(sortFunction)
            .slice(0, this.perPage);
          this.page = 1;
        } else {
          this.initialInitiativesForSorting.sort(sortFunction);
          this.initiatives = this.initialInitiativesForSorting.slice(
            0,
            this.perPage
          );
          this.page = 1;
        }
        this.activatedButton = initiativeName;
      } else {
        if (this.filteredInitiatives !== null) {
          this.filteredInitiatives = this.initialFilteredInitiatives.slice();
        } else {
          this.page = 1;
          this.initiatives = this.initialInitiatives.slice(0, this.perPage);
        }

        this.activatedButton = "";
      }
    },
    filterInitiatives(clickParam) {
      this.activatedButton = "";
      this.page = 1;
      let initiatives = this.initialInitiatives;

      let filterInputValue;

      if (typeof clickParam === "string") {
        filterInputValue = clickParam;
      } else {
        filterInputValue = this.filter;
      }

      let filterKeys = [
        "title",
        "Initiative",
        "popularity",
        "importance",
        "horizon",
        "author"
      ];
      this.filteredInitiatives = initiatives.filter(function(obj) {
        return filterKeys.some(function(key) {
          if (typeof obj[key] === "string" || typeof obj[key] === "number") {
            return obj[key]
              .toString()
              .toLowerCase()
              .includes(filterInputValue.toLowerCase());
          }
          if (typeof obj[key] === "object") {
            return obj[key]["horizon"]
              .toLowerCase()
              .includes(filterInputValue.toLowerCase());
          }
        });
      });
      this.totalPages = Math.ceil(
        this.filteredInitiatives.length / this.perPage
      );
      this.initialFilteredInitiatives = this.filteredInitiatives.slice();
    },
    clearInitiativesFilter() {
      this.filteredInitiatives = null;
      this.totalPages = Math.ceil(
        this.initialInitiatives.length / this.perPage
      );
    },
    paginationFunction(event) {
      this.sliceFrom = (event - 1) * this.perPage;
      this.page = event;
      let paginatedArray;
      if (this.filteredInitiatives !== null) {
        paginatedArray = this.initialFilteredInitiatives.slice(
          this.sliceFrom,
          this.sliceFrom + this.perPage
        );
        this.filteredInitiatives = paginatedArray.slice();
      } else {
        if (this.activatedButton === "") {
          paginatedArray = this.initialInitiatives.slice(
            this.sliceFrom,
            this.sliceFrom + this.perPage
          );
        } else {
          paginatedArray = this.initialInitiativesForSorting.slice(
            this.sliceFrom,
            this.sliceFrom + this.perPage
          );
        }
      }
      this.initiatives = paginatedArray;
    },

    onMove({ relatedContext, draggedContext }) {
      this.dragging = true;
      this.draggedContext = draggedContext;
      this.relatedContext = relatedContext;
    },
    onListChange(event) {},
    onEnd(event) {
      this.loading = true;
      this.dragging = false;
      const orgId = this.$store.state.organization.id;
      const orderChanger = () => {
        this.initialInitiativesForSorting.splice(
          this.sliceFrom,
          this.sliceFrom + this.perPage,
          ...this.relatedContext.list
        );
        let data = {
          items: [],
          initiatives: []
        };
        for (
          let i = 0, len = this.initialInitiativesForSorting.length;
          i < len;
          i++
        ) {
          let id = this.initialInitiativesForSorting[i].id;
          data.initiatives.push(id);
        }
        this.axios
          .put(`/api/orderindexchange/${orgId}`, data)
          .then(response => {
            this.loadOrgInitiatives();
          })
          .catch(err => {
            console.log(err);
          });
      };
      orderChanger();
    }
  },
  components: {
    draggable
  }
};
</script>

<style lang="scss">
.card {
  margin-top: 50px;
}

.initiatives {
  .header {
    margin-top: 10px;
  }
  .btnHeader {
    width: 4.5em;
    height: 2em;
    float: right;
    margin-top: 5px;
  }
}

.extra-small-button {
  width: 30px !important;
  height: 30px !important;
  &:focus {
    outline: none;
  }
  i {
    font-size: 15px;
  }
}
.v-toolbar--card {
  .checkbox {
    margin-top: 15px;
    label {
      margin-bottom: 0;
    }
  }
}

.cards-toolbar {
  height: auto !important;
  .v-btn {
    @media screen and (max-width: 1264px) {
      margin: 6px 4px;
    }
  }
  .clear-filter-botton {
    margin-bottom: 13px;
    @media screen and (max-width: 1264px) {
      margin-bottom: 13px;
    }
  }
}
.save-and-close-button {
  margin-left: 14px !important;
  @media screen and (max-width: 420px) {
    margin-left: 9px !important;
  }
}
</style>
