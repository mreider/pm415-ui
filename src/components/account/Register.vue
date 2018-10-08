<template>
  <b-form @submit="handleSubmit" class="register">
    <h2 class="center">Welcome to</h2>
    <h1 class="center">PM415</h1>
      <b-form-group>
          <b-form-input type="text" v-model="organization_name" v-if="showOrganization" :readonly=true placeholder="Organization">{{ organization_name }}</b-form-input>
      </b-form-group>
    <b-row>
      <b-col md="6" sm="12">
        <b-form-group>
          <b-form-input type="text" v-model="form.firstName" placeholder="First Name"></b-form-input>
        </b-form-group>
      </b-col>

      <b-col md="6" sm="12">
        <b-form-group>
          <b-form-input type="text" v-model="form.lastName" placeholder="Last Name"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6" sm="12">
        <b-form-group>
          <b-form-input type="email" required v-model="form.email" placeholder="Email"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6" sm="12">
        <b-form-group>
          <b-form-input type="password" v-model="form.password" placeholder="Password"></b-form-input>
        </b-form-group>
      </b-col>

      <b-col md="6" sm="12">
        <b-form-group>
          <b-form-input type="password" v-model="form.confirmation" placeholder="Confrmation"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row class="tos">
        <b-form-checkbox value="Y" v-model="form.tosAccepted">I accept <a href="#">Terms of Service</a> </b-form-checkbox>
    </b-row>

    <div class="button-box center">
      <b-button type="submit" variant="primary" :disabled="saving">Save</b-button>
      <a href="#" class="small" @click="onChangeForm && onChangeForm('login')">Already registered?</a>
    </div>
  </b-form>
</template>

<script>
import _get from 'lodash/get';

export default {
  name: 'Register',

  beforeCreate() {
  },

  mounted() {
    this.checkToken(this.token);
  },

  data() {
    return {
      form: {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        password: undefined,
        confirmation: undefined,
        organization: undefined,
        tosAccepted: false
      },
      saving: false,
      showOrganization: false,
      organization_name: ''
    };
  },
  computed: {
  },

  methods: {
    async checkToken(token) {
      this.showOrganization = false;
      if (token) {
        this.$loading(true);
        try {
          const response = await this.axios.get('api/org/invitelink/?token=' + token);
          const success = _get(response, 'data.success');
          console.log(_get(response, 'data'));
          if (success) {
            console.log(_get(response, 'data'));
            this.organization_name = _get(response, 'data.orgranization_name');
            this.form.organization = String(_get(response, 'data.organization_id'));
            this.form.email = _get(response, 'data.email');
            this.showOrganization = true;
          }
          if (!success) throw new Error(`Token invalid or missing.`);
        } catch (error) {
          return this.$errorMessage.show(error);
        } finally {
          this.$loading(false);
        }
      }
    },
    async handleSubmit(event) {
      event.preventDefault();
      try {
        let response = await this.axios.post('/api/account/register', this.form);
        const success = _get(response, 'data.userId');
        if (!success) throw new Error(_get(response, 'data.message', 'Unable to create account'));

        this.$notify({group: 'app', type: 'success', text: 'Your account created, please check your inbo for confirmation email.'});
        this.$router.push({ name: 'account' });
      } catch (error) {
        return this.$errorMessage.show(error);
      } finally {
        this.$loading(false);
      }
    }
  },

  props: {
    onChangeForm: Function,
    token: String
  }
};
</script>

<style lang="scss">
  .register {
    margin: auto;
    width: 500px;

    h1 {
      margin-bottom: 30px;
    }

    .tos {
      margin-left: 0;
    }
  }
</style>