<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <span class="headline">{{form.title}}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field v-model="form.title" placeholder="Title item"></v-text-field>
                  <label
                    class="text-left"
                  >Created by {{handleUsername(form.reportedBy)}} on {{new Date(form.createdAt).toLocaleString()}}</label>
                  <SubscribersList :subscribedUsers="subscribedUsers"/>
                  <v-textarea
                    v-model="form.description"
                    placeholder="Title description"
                    class="mt-3"
                    @keyup="checkText($event)"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-layout row wrap align-center>
                    <v-flex xs4>
                      <v-subheader class="select-box-subheader">Severity</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-select
                        :items="severityArray"
                        item-text="element"
                        item-value="element"
                        v-model="form.severity"
                        @input="handleBugSetField($event, 'severity')"
                        class="pt-0"
                      ></v-select>
                    </v-flex>
                    <v-flex xs4>
                      <v-subheader class="select-box-subheader">Status</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-select
                        :items="objStatuses"
                        item-value="id"
                        v-model="status.id"
                        return-object
                        @input="handleBugSetField($event, 'status')"
                        class="pt-0"
                      >
                        <template slot="selection" slot-scope="data">{{ data.item.name}}</template>
                        <template slot="item" slot-scope="data">
                          <v-list-tile-content>
                            <v-list-tile-title v-html="`${data.item.name}`"></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </v-select>
                    </v-flex>
                    <v-flex xs4>
                      <v-subheader class="select-box-subheader">Reported by:</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-select
                        :items="users"
                        item-value="userId"
                        v-model="reportedBy.userId"
                        return-object
                        @input="handleBugSetField($event, 'reportedBy')"
                        class="pt-0"
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >{{ data.item.firstName}} {{data.item.lastName}}</template>
                        <template slot="item" slot-scope="data">
                          <v-list-tile-content>
                            <v-list-tile-title
                              v-html="`${data.item.firstName} ${data.item.lastName}`"
                            ></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </v-select>
                    </v-flex>
                    <v-flex xs4>
                      <v-subheader class="select-box-subheader">Assignee:</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-select
                        :items="users"
                        item-value="userId"
                        v-model="assignee.userId"
                        return-object
                        @input="handleBugSetField($event, 'assignee')"
                        class="pt-0"
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >{{ data.item.firstName}} {{data.item.lastName}}</template>
                        <template slot="item" slot-scope="data">
                          <v-list-tile-content>
                            <v-list-tile-title
                              v-html="`${data.item.firstName} ${data.item.lastName}`"
                            ></v-list-tile-title>
                          </v-list-tile-content>
                        </template>
                      </v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs4>
                  <v-checkbox label="Archived: " v-model="form.archived"></v-checkbox>
                </v-flex>
                <v-flex xs8></v-flex>
                <v-flex xs12>
                  <Comments :toCommentsData="toCommentsData" ref="comments_ref"></Comments>
                </v-flex>
                <v-flex xs12>
                  <Connections :toConnectionData="toConnectionData"></Connections>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-layout row wrap mb-3>
              <v-btn
                color="blue darken-1"
                id="save-and-close-button__bug-component"
                flat
                outline
                small
                @click="handleSaveBug()"
              >Save and close</v-btn>
              <v-btn color="blue darken-1" flat small outline @click="$router.go(-1)">Back</v-btn>
              <v-btn
                color="blue darken-1"
                flat
                small
                outline
                @click="dialogDeleteBug = true"
                id="delete-button__bug-component"
              >Delete</v-btn>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <DeleteItemDialog
        :dialogDeleteItem="dialogDeleteBug"
        @deleteItem="handleBugDelete"
        @closeDialog="closeDeleteDialog"
    />
    <SubscribersListDialog :users="users" :dialogUserList="dialogUserList" @selectUser="selectChip"/>
  </v-container>
</template>

<script>
import _get from "lodash/get";
import _ from "lodash";
import Connections from "../common/connections.vue";
import Comments from "../common/comments.vue";
import { username } from "@/utils";
import SubscribersList from "../common/SubscribersList";
import SubscribersListDialog from "../common/SubscribersListDialog";
import DeleteItemDialog from "../common/DeleteItemDialog";

export default {
  name: "bug",
  data() {
    return {
      dialogDeleteBug: false,
      toConnectionData: {
        name: "bug",
        id: this.$route.query.bugId,
        connects: ["initiative", "item"]
      },
      toCommentsData: {
        name: "bugs",
        id: this.$route.query.bugId,
        admin: false
      },
      objStatuses: [],
      severityArray: ["P0", "P1", "P2", "P3"],
      users: [],
      reportedBy: { userId: "" },
      assignee: { userId: "" },
      status: { name: "None", id: 0 },
      form: {
        title: "",
        description: "",
        severity: "",
        status: { name: "None", id: 0 },
        reportedBy: {},
        assignee: {}
      },
      admin: false,
      dialogUserList: false,
      subscribedUsers: []
    };
  },
  async mounted() {
    await this.loadOrgStatuses();
    await this.loadOrgUsers();
    await this.loadOrgBug();
  },
  computed: {},
  methods: {
    async handleBugDelete() {
      const bugId = this.$route.query.bugId;
      try {
        let response = await this.axios.delete(
          `/api/bugs/${this.$store.state.organization.id}/${bugId}`
        );
        let success = _get(response, "data.success");
        if (!success) throw new Error(`Unable to delete bug.`);
      } catch (error) {
        return this.$errorMessage.show(error);
      } finally {
        this.$notify({
          group: "app",
          type: "success",
          text: `Bug ${this.form.title} was deleted`
        });
        this.$router.go(-1);
      }
    },
    closeDeleteDialog() {
      this.dialogDeleteBug = false;
    },
    async loadOrgBug() {
      try {
        this.$loading(true);
        const orgId = this.$route.query.orgId;
        const bugId = this.$route.query.bugId;
        const response = await this.axios.get(
          `/api/bugs/` + orgId + "/" + bugId
        );
        const success = _get(response, "data.success");
        if (!success) throw new Error(`Unable to load bugs's.`);
        let bug = _get(response, "data.bug");
        if (bug.archived === 0) {
          bug.archived = false;
        } else {
          bug.archived = true;
        }
        bug.status = _.find(this.objStatuses, { id: bug.statusId });
        this.toCommentsData.admin = _get(response, "data.admin");
        if (bug.statusId) {
          bug.status = _.find(this.objStatuses, { id: bug.statusId });
        } else {
          bug.status = { name: "None", id: 0 };
        }
        this.reportedBy.userId = bug.reportedBy.id;
        this.assignee.userId = bug.assignee.id;
        this.status = bug.status;
        bug.assignee.userId = bug.assignee.id;
        bug.reportedBy.userId = bug.reportedBy.id;
        bug.createdAt = new Date(bug.createdAt).toLocaleString();
        this.form = bug;
        this.loadSubscribers(bugId);
      } catch (error) {
        return this.$errorMessage.show(error);
      } finally {
        this.$loading(false);
      }
    },
    handleBugSetField(element, name) {
      this.form[name] = element;
    },
    async handleSaveBug() {
      try {
        const orgId = this.$route.query.orgId;
        const bugId = this.$route.query.bugId;
        let data = {};

        if (this.form.assignee) {
          data.assignee = String(this.form.assignee.userId);
        }

        data.description = this.form.description;
        data.title = this.form.title;
        data.archived = this.form.archived;
        data.severity = this.form.severity;

        if (this.form.reportedBy) {
          data.createdBy = String(this.form.reportedBy.userId);
        }

        if (this.form.status.id !== 0) {
          data.statusId = String(this.form.status.id);
        } else {
          data.statusId = String(this.status.id);
        }

        delete data.status;
        const response = await this.axios.put(
          `/api/bugs/edit/${orgId}/${bugId}`,
          data
        );
        const success = _get(response, "data.success");
        if (!success) throw new Error(`Unable to update bug.`);
        this.subscribeUsers();
        const newComment = this.$refs["comments_ref"].newComment;
        if (newComment) {
          this.$refs["comments_ref"].handleNewComment(
            this.$refs["comments_ref"].newComment
          );
        }
      } catch (error) {
        return this.$errorMessage.show(error);
      } finally {
        this.$router.go(-1);
        this.$notify({ group: "app", type: "success", text: "Bug updated" });
      }
    },
    handleUsername(element) {
      return username(element);
    },
    async loadOrgStatuses() {
      try {
        this.$loading(true);
        const orgId = this.$store.state.organization.id;
        const response = await this.axios.get(`/api/statuses/bugs/${orgId}`);
        const success = _get(response, "data.success");
        if (!success) throw new Error(`Unable to load user's organizations.`);
        this.objStatuses = _get(response, "data.statuses");
      } catch (error) {
        return this.$errorMessage.show(error);
      } finally {
        this.$loading(false);
      }
    },
    async loadOrgUsers() {
      try {
        const orgId = this.$store.state.organization.id;
        this.$loading(true);
        const response = await this.axios.get(`/api/org/${orgId}/users`);
        const success = _get(response, "data.success");
        if (!success) throw new Error(`Unable to load user's organizations.`);
        const users = _get(response, "data.users");
        this.users = users;
      } catch (error) {
        return this.$errorMessage.show(error);
      } finally {
        this.$loading(false);
      }
    },
    loadSubscribers(ownerId) {
      const ownerTable = this.$route.name.toLowerCase() + "s";
      this.axios
        .get(`/api/subscribers/${ownerTable}/${ownerId}`)
        .then(response => {
          this.subscribedUsers = response.data.subscribers;
          this.$loading(false);
        })
        .catch(err => {
          console.log(err);
        });
    },
    checkText(e) {
      if (e.key === "@") this.dialogUserList = true;
    },
    selectChip($event) {
      this.dialogUserList = false;
      const userId = Number($event.target.parentNode.id);
      let textArray;
      textArray = this.form.description.trim().split(" ");
      const foundUser = this.users.find((item) => item.userId === userId);
      if (foundUser) {
        for (let [index, word] of textArray.entries()) {
          if (word === "@") {
            textArray[index] = `@${foundUser.firstName + foundUser.lastName}`;
          }
        }
        this.form.description = textArray.join(" ");
        if (!this.subscribedUsers.find((item) => item.id === userId)) {
          foundUser.id = userId;
          this.subscribedUsers.push(foundUser);
        }
      }
    },
    subscribeUsers() {
      const ownerTable = this.$route.name.toLowerCase() + "s";
      const ownerId = this.$route.query.bugId;
      let usersIds = [];
      for (let item of this.subscribedUsers) {
        usersIds.push(item.userId || item.id);
      }
      this.axios
        .post(`/api/subscribers/new/${ownerTable}/${ownerId}`, {
          usersId: usersIds
        })
        .then(response => {
          this.$loading(false);
        })
        .catch(err => {
          console.log(err);
          this.$loading(false);
        });
    },
    removeSubscribedUser(item) {
      const itemIndex = this.subscribedUsers.findIndex(chipUser => chipUser.id === item.id);
      if (itemIndex >= 0) {
        const ownerTable = this.$route.name.toLowerCase() + "s";
        const ownerId = this.$route.query.bugId;
        let usersIds = [];
        usersIds.push(String(item.id));
        this.$loading(true);
        this.axios
          .post(`/api/subscribers/delete/${ownerTable}/${ownerId}`, {
            usersId: usersIds
          })
          .then(response => {
            this.$loading(false);
            this.subscribedUsers.splice(itemIndex, 1);
          })
          .catch(err => {
            console.log(err);
            this.$loading(false);
          });
      }
    }
  },
  components: {
    Comments: Comments,
    Connections: Connections,
    SubscribersList,
    SubscribersListDialog,
    DeleteItemDialog
  }
};
</script>

<style lang="scss">
.card {
  margin-top: 50px;
}
.description {
  outline: 0in;
  border: 1px solid lightblue;
}

.comments-card {
  padding-left: 25px;
}

#save-and-close-button__bug-component {
  margin-left: 31px !important;
  @media screen and (max-width: 420px) {
    margin-left: 15px !important;
  }
}
.select-box-subheader {
  @media screen and (max-width: 420px) {
    padding-left: 0;
    padding-right: 0;
  }
}

#delete-button__bug-component {
  @media screen and (max-width: 320px) {
    margin: 10px 0 0 15px;
  }
}

.v-btn__content {
  @media screen and (max-width: 320px) {
    font-size: 9px !important;
  }
}
</style>
