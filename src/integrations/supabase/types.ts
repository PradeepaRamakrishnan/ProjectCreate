/* eslint-disable @typescript-eslint/no-explicit-any */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      agent_chats: {
        Row: {
          agent_id: string;
          created_at: string;
          id: string;
          message: string;
          prompt: string;
          updated_at: string;
        };
        Insert: {
          agent_id: string;
          created_at: string;
          id?: string;
          message: string;
          prompt: string;
          updated_at: string;
        };
        Update: {
          agent_id?: string;
          created_at?: string;
          id?: string;
          message?: string;
          prompt?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agent_chats_agent_id_foreign";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "workflows";
            referencedColumns: ["id"];
          }
        ];
      };
      agent_logs: {
        Row: {
          agent_id: string;
          id: number;
          level: string;
          message: string;
          metadata: Json | null;
          source: string | null;
          timestamp: string;
          trace_id: string | null;
        };
        Insert: {
          agent_id: string;
          id?: number;
          level: string;
          message: string;
          metadata?: Json | null;
          source?: string | null;
          timestamp: string;
          trace_id?: string | null;
        };
        Update: {
          agent_id?: string;
          id?: number;
          level?: string;
          message?: string;
          metadata?: Json | null;
          source?: string | null;
          timestamp?: string;
          trace_id?: string | null;
        };
        Relationships: [];
      };
      agent_metrics: {
        Row: {
          agent_id: string;
          id: number;
          metadata: Json | null;
          metric_name: string;
          metric_value: number;
          timestamp: string;
        };
        Insert: {
          agent_id: string;
          id?: number;
          metadata?: Json | null;
          metric_name: string;
          metric_value: number;
          timestamp: string;
        };
        Update: {
          agent_id?: string;
          id?: number;
          metadata?: Json | null;
          metric_name?: string;
          metric_value?: number;
          timestamp?: string;
        };
        Relationships: [];
      };
      agents: {
        Row: {
          agent_description: string | null;
          agent_name: string;
          chat_history: Json | null;
          created_at: string;
          document_content: string | null;
          documents: string[] | null;
          id: string;
          knowledge: Json | null;
          last_run: string | null;
          logs: string[] | null;
          next_run: string | null;
          output_type: string;
          privacy_mode: string;
          process_id: string | null;
          project_id: string | null;
          questions: string[] | null;
          research_goal: string | null;
          sources: string[] | null;
          status: string;
          topic: string;
          update_frequency: string;
          updated_at: string;
          uploaded_docs: string[] | null;
          used_documents: Json | null;
          user_id: string;
        };
        Insert: {
          agent_description?: string | null;
          agent_name: string;
          chat_history?: Json | null;
          created_at: string;
          document_content?: string | null;
          documents?: string[] | null;
          id: string;
          knowledge?: Json | null;
          last_run?: string | null;
          logs?: string[] | null;
          next_run?: string | null;
          output_type: string;
          privacy_mode: string;
          process_id?: string | null;
          project_id?: string | null;
          questions?: string[] | null;
          research_goal?: string | null;
          sources?: string[] | null;
          status: string;
          topic?: string;
          update_frequency: string;
          updated_at: string;
          uploaded_docs?: string[] | null;
          used_documents?: Json | null;
          user_id: string;
        };
        Update: {
          agent_description?: string | null;
          agent_name?: string;
          chat_history?: Json | null;
          created_at?: string;
          document_content?: string | null;
          documents?: string[] | null;
          id?: string;
          knowledge?: Json | null;
          last_run?: string | null;
          logs?: string[] | null;
          next_run?: string | null;
          output_type?: string;
          privacy_mode?: string;
          process_id?: string | null;
          project_id?: string | null;
          questions?: string[] | null;
          research_goal?: string | null;
          sources?: string[] | null;
          status?: string;
          topic?: string;
          update_frequency?: string;
          updated_at?: string;
          uploaded_docs?: string[] | null;
          used_documents?: Json | null;
          user_id?: string;
        };
        Relationships: [];
      };
      auth_group: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      auth_group_permissions: {
        Row: {
          group_id: number;
          id: number;
          permission_id: number;
        };
        Insert: {
          group_id: number;
          id?: number;
          permission_id: number;
        };
        Update: {
          group_id?: number;
          id?: number;
          permission_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm";
            columns: ["permission_id"];
            isOneToOne: false;
            referencedRelation: "auth_permission";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "auth_group";
            referencedColumns: ["id"];
          }
        ];
      };
      auth_permission: {
        Row: {
          codename: string;
          content_type_id: number;
          id: number;
          name: string;
        };
        Insert: {
          codename: string;
          content_type_id: number;
          id?: number;
          name: string;
        };
        Update: {
          codename?: string;
          content_type_id?: number;
          id?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "auth_permission_content_type_id_2f476e4b_fk_django_co";
            columns: ["content_type_id"];
            isOneToOne: false;
            referencedRelation: "django_content_type";
            referencedColumns: ["id"];
          }
        ];
      };
      auth_user: {
        Row: {
          date_joined: string;
          email: string;
          first_name: string;
          id: number;
          is_active: boolean;
          is_staff: boolean;
          is_superuser: boolean;
          last_login: string | null;
          last_name: string;
          password: string;
          username: string;
        };
        Insert: {
          date_joined: string;
          email: string;
          first_name: string;
          id?: number;
          is_active: boolean;
          is_staff: boolean;
          is_superuser: boolean;
          last_login?: string | null;
          last_name: string;
          password: string;
          username: string;
        };
        Update: {
          date_joined?: string;
          email?: string;
          first_name?: string;
          id?: number;
          is_active?: boolean;
          is_staff?: boolean;
          is_superuser?: boolean;
          last_login?: string | null;
          last_name?: string;
          password?: string;
          username?: string;
        };
        Relationships: [];
      };
      auth_user_groups: {
        Row: {
          group_id: number;
          id: number;
          user_id: number;
        };
        Insert: {
          group_id: number;
          id?: number;
          user_id: number;
        };
        Update: {
          group_id?: number;
          id?: number;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "auth_user_groups_group_id_97559544_fk_auth_group_id";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "auth_group";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "auth_user_groups_user_id_6a12ed8b_fk_auth_user_id";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "auth_user";
            referencedColumns: ["id"];
          }
        ];
      };
      auth_user_user_permissions: {
        Row: {
          id: number;
          permission_id: number;
          user_id: number;
        };
        Insert: {
          id?: number;
          permission_id: number;
          user_id: number;
        };
        Update: {
          id?: number;
          permission_id?: number;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm";
            columns: ["permission_id"];
            isOneToOne: false;
            referencedRelation: "auth_permission";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "auth_user";
            referencedColumns: ["id"];
          }
        ];
      };
      chats: {
        Row: {
          created_at: string;
          id: string;
          message: string | null;
          project: string;
          prompt: string | null;
          updated_at: string;
        };
        Insert: {
          created_at: string;
          id?: string;
          message?: string | null;
          project: string;
          prompt?: string | null;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string | null;
          project?: string;
          prompt?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      django_admin_log: {
        Row: {
          action_flag: number;
          action_time: string;
          change_message: string;
          content_type_id: number | null;
          id: number;
          object_id: string | null;
          object_repr: string;
          user_id: number;
        };
        Insert: {
          action_flag: number;
          action_time: string;
          change_message: string;
          content_type_id?: number | null;
          id?: number;
          object_id?: string | null;
          object_repr: string;
          user_id: number;
        };
        Update: {
          action_flag?: number;
          action_time?: string;
          change_message?: string;
          content_type_id?: number | null;
          id?: number;
          object_id?: string | null;
          object_repr?: string;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "django_admin_log_content_type_id_c4bce8eb_fk_django_co";
            columns: ["content_type_id"];
            isOneToOne: false;
            referencedRelation: "django_content_type";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "django_admin_log_user_id_c564eba6_fk_auth_user_id";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "auth_user";
            referencedColumns: ["id"];
          }
        ];
      };
      django_celery_beat_clockedschedule: {
        Row: {
          clocked_time: string;
          id: number;
        };
        Insert: {
          clocked_time: string;
          id?: number;
        };
        Update: {
          clocked_time?: string;
          id?: number;
        };
        Relationships: [];
      };
      django_celery_beat_crontabschedule: {
        Row: {
          day_of_month: string;
          day_of_week: string;
          hour: string;
          id: number;
          minute: string;
          month_of_year: string;
          timezone: string;
        };
        Insert: {
          day_of_month: string;
          day_of_week: string;
          hour: string;
          id?: number;
          minute: string;
          month_of_year: string;
          timezone: string;
        };
        Update: {
          day_of_month?: string;
          day_of_week?: string;
          hour?: string;
          id?: number;
          minute?: string;
          month_of_year?: string;
          timezone?: string;
        };
        Relationships: [];
      };
      django_celery_beat_intervalschedule: {
        Row: {
          every: number;
          id: number;
          period: string;
        };
        Insert: {
          every: number;
          id?: number;
          period: string;
        };
        Update: {
          every?: number;
          id?: number;
          period?: string;
        };
        Relationships: [];
      };
      django_celery_beat_periodictask: {
        Row: {
          args: string;
          clocked_id: number | null;
          crontab_id: number | null;
          date_changed: string;
          description: string;
          enabled: boolean;
          exchange: string | null;
          expire_seconds: number | null;
          expires: string | null;
          headers: string;
          id: number;
          interval_id: number | null;
          kwargs: string;
          last_run_at: string | null;
          name: string;
          one_off: boolean;
          priority: number | null;
          queue: string | null;
          routing_key: string | null;
          solar_id: number | null;
          start_time: string | null;
          task: string;
          total_run_count: number;
        };
        Insert: {
          args: string;
          clocked_id?: number | null;
          crontab_id?: number | null;
          date_changed: string;
          description: string;
          enabled: boolean;
          exchange?: string | null;
          expire_seconds?: number | null;
          expires?: string | null;
          headers: string;
          id?: number;
          interval_id?: number | null;
          kwargs: string;
          last_run_at?: string | null;
          name: string;
          one_off: boolean;
          priority?: number | null;
          queue?: string | null;
          routing_key?: string | null;
          solar_id?: number | null;
          start_time?: string | null;
          task: string;
          total_run_count: number;
        };
        Update: {
          args?: string;
          clocked_id?: number | null;
          crontab_id?: number | null;
          date_changed?: string;
          description?: string;
          enabled?: boolean;
          exchange?: string | null;
          expire_seconds?: number | null;
          expires?: string | null;
          headers?: string;
          id?: number;
          interval_id?: number | null;
          kwargs?: string;
          last_run_at?: string | null;
          name?: string;
          one_off?: boolean;
          priority?: number | null;
          queue?: string | null;
          routing_key?: string | null;
          solar_id?: number | null;
          start_time?: string | null;
          task?: string;
          total_run_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "django_celery_beat_p_clocked_id_47a69f82_fk_django_ce";
            columns: ["clocked_id"];
            isOneToOne: false;
            referencedRelation: "django_celery_beat_clockedschedule";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "django_celery_beat_p_crontab_id_d3cba168_fk_django_ce";
            columns: ["crontab_id"];
            isOneToOne: false;
            referencedRelation: "django_celery_beat_crontabschedule";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "django_celery_beat_p_interval_id_a8ca27da_fk_django_ce";
            columns: ["interval_id"];
            isOneToOne: false;
            referencedRelation: "django_celery_beat_intervalschedule";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "django_celery_beat_p_solar_id_a87ce72c_fk_django_ce";
            columns: ["solar_id"];
            isOneToOne: false;
            referencedRelation: "django_celery_beat_solarschedule";
            referencedColumns: ["id"];
          }
        ];
      };
      django_celery_beat_periodictasks: {
        Row: {
          ident: number;
          last_update: string;
        };
        Insert: {
          ident: number;
          last_update: string;
        };
        Update: {
          ident?: number;
          last_update?: string;
        };
        Relationships: [];
      };
      django_celery_beat_solarschedule: {
        Row: {
          event: string;
          id: number;
          latitude: number;
          longitude: number;
        };
        Insert: {
          event: string;
          id?: number;
          latitude: number;
          longitude: number;
        };
        Update: {
          event?: string;
          id?: number;
          latitude?: number;
          longitude?: number;
        };
        Relationships: [];
      };
      django_content_type: {
        Row: {
          app_label: string;
          id: number;
          model: string;
        };
        Insert: {
          app_label: string;
          id?: number;
          model: string;
        };
        Update: {
          app_label?: string;
          id?: number;
          model?: string;
        };
        Relationships: [];
      };
      django_migrations: {
        Row: {
          app: string;
          applied: string;
          id: number;
          name: string;
        };
        Insert: {
          app: string;
          applied: string;
          id?: number;
          name: string;
        };
        Update: {
          app?: string;
          applied?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      django_session: {
        Row: {
          expire_date: string;
          session_data: string;
          session_key: string;
        };
        Insert: {
          expire_date: string;
          session_data: string;
          session_key: string;
        };
        Update: {
          expire_date?: string;
          session_data?: string;
          session_key?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          name: string;
          project_id: string | null;
          public_url: string;
          size: number;
          starred: boolean;
          storage_path: string;
          type: string;
          updated_at: string;
          upload_date: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          created_at: string;
          id?: string;
          name: string;
          project_id?: string | null;
          public_url: string;
          size: number;
          starred?: boolean;
          storage_path: string;
          type: string;
          updated_at: string;
          upload_date: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          name?: string;
          project_id?: string | null;
          public_url?: string;
          size?: number;
          starred?: boolean;
          storage_path?: string;
          type?: string;
          updated_at?: string;
          upload_date?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_user_id_foreign";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      folders: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          active?: boolean;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          user_id?: string | null;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      knowledge_graph_chats: {
        Row: {
          created_at: string;
          id: string;
          message: string;
          project_id: string;
          prompt: string;
          updated_at: string;
        };
        Insert: {
          created_at: string;
          id: string;
          message: string;
          project_id: string;
          prompt: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string;
          project_id?: string;
          prompt?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "knowledge_graph_chats_project_id_foreign";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      knowledge_graphs: {
        Row: {
          created_at: string;
          error_details: Json | null;
          id: string;
          name: string;
          page_count: number;
          payload: Json;
          project: string;
          status: string;
          status_detail: Json;
          tree_root_id: string | null;
          updated_at: string;
          user: string;
        };
        Insert: {
          created_at: string;
          error_details?: Json | null;
          id: string;
          name: string;
          page_count: number;
          payload: Json;
          project: string;
          status: string;
          status_detail: Json;
          tree_root_id?: string | null;
          updated_at: string;
          user: string;
        };
        Update: {
          created_at?: string;
          error_details?: Json | null;
          id?: string;
          name?: string;
          page_count?: number;
          payload?: Json;
          project?: string;
          status?: string;
          status_detail?: Json;
          tree_root_id?: string | null;
          updated_at?: string;
          user?: string;
        };
        Relationships: [];
      };
      knowledge_timelines: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
          project: string | null;
          timeline_data: Json;
          updated_at: string;
        };
        Insert: {
          created_at: string;
          id: string;
          name?: string | null;
          project?: string | null;
          timeline_data: Json;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
          project?: string | null;
          timeline_data?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      knowledge_trees: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          project: string;
          tree_data: string | null;
          updated_at: string;
        };
        Insert: {
          created_at: string;
          id: string;
          name: string;
          project: string;
          tree_data?: string | null;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          project?: string;
          tree_data?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      mikro_orm_migrations: {
        Row: {
          executed_at: string | null;
          id: number;
          name: string | null;
        };
        Insert: {
          executed_at?: string | null;
          id?: number;
          name?: string | null;
        };
        Update: {
          executed_at?: string | null;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      nodes: {
        Row: {
          assignee: string | null;
          assignee_class: string | null;
          color: string;
          created_at: string;
          file_url: string;
          id: string;
          knowledge_graph_id: string;
          name: string;
          page: string;
          project_id: string;
          properties: Json;
          semantic_type: string;
          strength: string;
          type: string;
          umls_cui: string | null;
          updated_at: string;
        };
        Insert: {
          assignee?: string | null;
          assignee_class?: string | null;
          color: string;
          created_at: string;
          file_url: string;
          id: string;
          knowledge_graph_id: string;
          name: string;
          page: string;
          project_id: string;
          properties: Json;
          semantic_type: string;
          strength: string;
          type: string;
          umls_cui?: string | null;
          updated_at: string;
        };
        Update: {
          assignee?: string | null;
          assignee_class?: string | null;
          color?: string;
          created_at?: string;
          file_url?: string;
          id?: string;
          knowledge_graph_id?: string;
          name?: string;
          page?: string;
          project_id?: string;
          properties?: Json;
          semantic_type?: string;
          strength?: string;
          type?: string;
          umls_cui?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nodes_knowledge_graph_id_e8b90079_fk_knowledge_graphs_id";
            columns: ["knowledge_graph_id"];
            isOneToOne: false;
            referencedRelation: "knowledge_graphs";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          active: boolean;
          body: string;
          created_at: string;
          id: string;
          read: boolean;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          body: string;
          created_at: string;
          id: string;
          read?: boolean;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          body?: string;
          created_at?: string;
          id?: string;
          read?: boolean;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_foreign";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      plans: {
        Row: {
          active: boolean;
          created_at: string;
          currency: string;
          description: string;
          id: string;
          interval: string;
          interval_count: number;
          name: string;
          price: number;
          seats: number | null;
          storage: number | null;
          stripe_price_id: string;
          stripe_product_id: string;
          total_tokens: number | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at: string;
          currency?: string;
          description: string;
          id: string;
          interval: string;
          interval_count?: number;
          name: string;
          price: number;
          seats?: number | null;
          storage?: number | null;
          stripe_price_id: string;
          stripe_product_id: string;
          total_tokens?: number | null;
          updated_at: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          currency?: string;
          description?: string;
          id?: string;
          interval?: string;
          interval_count?: number;
          name?: string;
          price?: number;
          seats?: number | null;
          storage?: number | null;
          stripe_price_id?: string;
          stripe_product_id?: string;
          total_tokens?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_collaborators: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          project_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          project_id: string;
          status: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          project_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          archived: boolean;
          created_at: string;
          description: string;
          featured: boolean | null;
          files: Json;
          id: string;
          name: string;
          source: Json | null;
          status: string;
          team_id: string | null;
          updated_at: string;
          user_id: string;
          visibility: string;
        };
        Insert: {
          archived?: boolean;
          created_at: string;
          description: string;
          featured?: boolean | null;
          files?: Json;
          id?: string;
          name: string;
          source?: Json | null;
          status?: string;
          team_id?: string | null;
          updated_at: string;
          user_id: string;
          visibility: string;
        };
        Update: {
          archived?: boolean;
          created_at?: string;
          description?: string;
          featured?: boolean | null;
          files?: Json;
          id?: string;
          name?: string;
          source?: Json | null;
          status?: string;
          team_id?: string | null;
          updated_at?: string;
          user_id?: string;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_team_id_foreign";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          }
        ];
      };
      relationships: {
        Row: {
          created_at: string;
          id: string;
          knowledge_graph_id: string;
          relation_type: string;
          source_id: string;
          strength: string;
          target_id: string;
          updated_at: string;
        };
        Insert: {
          created_at: string;
          id: string;
          knowledge_graph_id: string;
          relation_type: string;
          source_id: string;
          strength: string;
          target_id: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          knowledge_graph_id?: string;
          relation_type?: string;
          source_id?: string;
          strength?: string;
          target_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "relationships_knowledge_graph_id_d6dfb1e2_fk_knowledge";
            columns: ["knowledge_graph_id"];
            isOneToOne: false;
            referencedRelation: "knowledge_graphs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "relationships_source_id_8c9e4108_fk_nodes_id";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "nodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "relationships_target_id_f09f30cd_fk_nodes_id";
            columns: ["target_id"];
            isOneToOne: false;
            referencedRelation: "nodes";
            referencedColumns: ["id"];
          }
        ];
      };
      rest_framework_api_key_apikey: {
        Row: {
          created: string;
          expiry_date: string | null;
          hashed_key: string;
          id: string;
          name: string;
          prefix: string;
          revoked: boolean;
        };
        Insert: {
          created: string;
          expiry_date?: string | null;
          hashed_key: string;
          id: string;
          name: string;
          prefix: string;
          revoked: boolean;
        };
        Update: {
          created?: string;
          expiry_date?: string | null;
          hashed_key?: string;
          id?: string;
          name?: string;
          prefix?: string;
          revoked?: boolean;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          active: boolean | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created_at: string;
          current_period_end: string | null;
          current_period_start: string | null;
          ended_at: string | null;
          id: string;
          plan_id: any;
          status: string;
          stripe_customer_id: string | null;
          stripe_session_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active?: boolean | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created_at: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          ended_at?: string | null;
          id: string;
          plan_id: any;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_session_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at: string;
          name: string;

          user_id: string;
        };
        Update: {
          active?: boolean | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          ended_at?: string | null;
          id?: string;
          plan_id?: any;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_session_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
          user_id?: string;
       

        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_foreign";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_user_id_foreign";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      team_members: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          invite_status: string;
          message: string | null;
          role: string;
          team_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at: string;
          email: string;
          id: string;
          invite_status?: string;
          message?: string | null;
          role?: string;
          team_id: string;
          updated_at: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          invite_status?: string;
          message?: string | null;
          role?: string;
          team_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_foreign";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "team_members_user_id_foreign";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      teams: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at: string;
          description?: string | null;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teams_user_id_foreign";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      transactions: {
        Row: {
          agent: string;
          chat: string;
          created_at: string;
          id: string;
          knowledge_graph: string;
          total_cost: number;
          total_tokens: number;
          type: string;
          updated_at: string;
          user: string;
        };
        Insert: {
          agent: string;
          chat: string;
          created_at: string;
          id: string;
          knowledge_graph: string;
          total_cost: number;
          total_tokens: number;
          type: string;
          updated_at: string;
          user: string;
        };
        Update: {
          agent?: string;
          chat?: string;
          created_at?: string;
          id?: string;
          knowledge_graph?: string;
          total_cost?: number;
          total_tokens?: number;
          type?: string;
          updated_at?: string;
          user?: string;
        };
        Relationships: [];
      };
      user_activities: {
        Row: {
          action_description: string;
          action_type: string;
          created_at: string | null;
          id: string;
          ip_address: string | null;
          metadata: Json | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action_description: string;
          action_type: string;
          created_at?: string | null;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action_description?: string;
          action_type?: string;
          created_at?: string | null;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          active: boolean;
          avatar_url: string | null;
          created_at: string;
          email: string;
          email_verified: boolean;
          fcm_token: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          provider: string;
          roles: string[] | null;
          subscription_id: string | null;
          subscription_status: string | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          active?: boolean;
          avatar_url?: string | null;
          created_at: string;
          email: string;
          email_verified?: boolean;
          fcm_token?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          provider?: string;
          roles?: string[] | null;
          subscription_id?: string | null;
          subscription_status?: string | null;
          updated_at: string;
          username?: string | null;
        };
        Update: {
          active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          email_verified?: boolean;
          fcm_token?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          provider?: string;
          roles?: string[] | null;
          subscription_id?: string | null;
          subscription_status?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          }
        ];
      };
      "users-query": {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          knowledge_graph: Json | null;
          query: string | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at: string;
          id: string;
          knowledge_graph?: Json | null;
          query?: string | null;
          updated_at: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          knowledge_graph?: Json | null;
          query?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      workflow_logs: {
        Row: {
          agent_id: string;
          id: string;
          log_level: string;
          message: string;
          metadata: Json;
          timestamp: string;
        };
        Insert: {
          agent_id: string;
          id: string;
          log_level: string;
          message: string;
          metadata: Json;
          timestamp: string;
        };
        Update: {
          agent_id?: string;
          id?: string;
          log_level?: string;
          message?: string;
          metadata?: Json;
          timestamp?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workflow_logs_agent_id_fc4dd4cd_fk_workflows_id";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "workflows";
            referencedColumns: ["id"];
          }
        ];
      };
      workflows: {
        Row: {
          created_at: string;
          description: string;
          goal: string;
          id: string;
          is_running: boolean;
          name: string;
          output_type: string;
          outputs: string | null;
          privacy_mode: string;
          project_id: string;
          questions: Json | null;
          saved_outputs: Json | null;
          sources: Json;
          status: string;
          timezone: string;
          topic: string;
          update_frequency: string;
          updated_at: string;
          uploaded_docs: Json | null;
          used_docs: Json | null;
          user_id: string;
          assigned_user: boolean;
        };
        Insert: {
          created_at: string;
          description: string;
          goal: string;
          id: string;
          is_running: boolean;
          name: string;
          output_type: string;
          outputs?: string | null;
          privacy_mode: string;
          project_id: string;
          questions?: Json | null;
          saved_outputs?: Json | null;
          sources: Json;
          status: string;
          timezone: string;
          topic: string;
          update_frequency: string;
          updated_at: string;
          uploaded_docs?: Json | null;
          used_docs?: Json | null;
          user_id: string;
          assigned_user?: boolean;
        };
        Update: {
          created_at?: string;
          description?: string;
          goal?: string;
          id?: string;
          is_running?: boolean;
          name?: string;
          output_type?: string;
          outputs?: string | null;
          privacy_mode?: string;
          project_id?: string;
          questions?: Json | null;
          saved_outputs?: Json | null;
          sources?: Json;
          status?: string;
          timezone?: string;
          topic?: string;
          update_frequency?: string;
          updated_at?: string;
          uploaded_docs?: Json | null;
          used_docs?: Json | null;
          user_id?: string;
          assigned_user?: boolean;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          status: string;
          logo_img: string | null;
          countries: string[] | null;
          key_areas: string[] | null;
          latest_news: string[] | null;
          credo: {
            text: string;
            since?: number; // observed in data
          } | null;
          created_at: string;
          updated_at: string;
          global_employees: number | null;
          team_size: string | null;
          annual_revenue: number | null;
          rnd_investment: number | null;
          patents_filed: number | null;
          description: string | null;
          business_segments:
            | {
                id: string;
                name: string;
                growth: string | null;
                revenue: string | null;
                description: string | null;
              }[]
            | null;
          founded_year: number | null;
          years_of_innovation: number | null;
          fortune_rank: number | null;
          operating_companies: string[] | null;
          vision: {
            title: string;
            description: string;
          } | null;
          ceo_quote: {
            name: string;
            socials: Record<string, string>;
            position: string;
            description: string;
          } | null;
          milestones:
            | {
                id: string;
                year: number;
                description: string;
              }[]
            | null;
          batch: string | null;
          socials: {
            x?: string;
            website?: string;
            linkedin?: string;
            crunchbase?: string;
            [key: string]: string | undefined;
          } | null;
          founders:
            | {
                name: string;
                socials: Record<string, string>;
                position: string;
                description: string;
              }[]
            | null;
          url: string | null;
          ai_processed: boolean | null;
          seo: {
            slug: string;
            keywords: {
              term: string;
              source: string;
            }[];
            page_title: string;
            meta_description: string;
          } | null;
          company_innovations_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          status: string;
          logo_img?: string | null;
          countries?: string[] | null;
          key_areas?: string[] | null;
          latest_news?: string[] | null;
          credo?: {
            text: string;
            since?: number;
          } | null;
          created_at?: string;
          updated_at?: string;
          global_employees?: number | null;
          team_size?: string | null;
          annual_revenue?: number | null;
          rnd_investment?: number | null;
          patents_filed?: number | null;
          description?: string | null;
          business_segments?:
            | {
                id: string;
                name: string;
                growth: string | null;
                revenue: string | null;
                description: string | null;
              }[]
            | null;
          founded_year?: number | null;
          years_of_innovation?: number | null;
          fortune_rank?: number | null;
          operating_companies?: string[] | null;
          vision?: {
            title: string;
            description: string;
          } | null;
          ceo_quote?: {
            name: string;
            socials: Record<string, string>;
            position: string;
            description: string;
          } | null;
          milestones?:
            | {
                id: string;
                year: number;
                description: string;
              }[]
            | null;
          batch?: string | null;
          socials?: {
            x?: string;
            website?: string;
            linkedin?: string;
            crunchbase?: string;
            [key: string]: string | undefined;
          } | null;
          founders?:
            | {
                name: string;
                socials: Record<string, string>;
                position: string;
                description: string;
              }[]
            | null;
          url?: string | null;
          ai_processed?: boolean | null;
          seo?: {
            slug: string;
            keywords: {
              term: string;
              source: string;
            }[];
            page_title: string;
            meta_description: string;
          } | null;
          company_innovations_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          status?: string;
          logo_img?: string | null;
          countries?: string[] | null;
          key_areas?: string[] | null;
          latest_news?: string[] | null;
          credo?: {
            text: string;
            since?: number;
          } | null;
          created_at?: string;
          updated_at?: string;
          global_employees?: number | null;
          team_size?: string | null;
          annual_revenue?: number | null;
          rnd_investment?: number | null;
          patents_filed?: number | null;
          description?: string | null;
          business_segments?:
            | {
                id: string;
                name: string;
                growth: string | null;
                revenue: string | null;
                description: string | null;
              }[]
            | null;
          founded_year?: number | null;
          years_of_innovation?: number | null;
          fortune_rank?: number | null;
          operating_companies?: string[] | null;
          vision?: {
            title: string;
            description: string;
          } | null;
          ceo_quote?: {
            name: string;
            socials: Record<string, string>;
            position: string;
            description: string;
          } | null;
          milestones?:
            | {
                id: string;
                year: number;
                description: string;
              }[]
            | null;
          batch?: string | null;
          socials?: {
            x?: string;
            website?: string;
            linkedin?: string;
            crunchbase?: string;
            [key: string]: string | undefined;
          } | null;
          founders?:
            | {
                name: string;
                socials: Record<string, string>;
                position: string;
                description: string;
              }[]
            | null;
          url?: string | null;
          ai_processed?: boolean | null;
          seo?: {
            slug: string;
            keywords: {
              term: string;
              source: string;
            }[];
            page_title: string;
            meta_description: string;
          } | null;
          company_innovations_id?: string | null;
        };
        Relationships: [];
      };

      researchers: {
        Row: {
          id: string;
          name: string | null;
          profile_img: string | null;
          institution: string | null;
          total_citations: number | null;
          expertise_tags: string[] | null;
          publications: Json[] | null;
          research_contributions: string[] | null;
          highlight: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          name: string | null;
          profile_img: string | null;
          institution: string | null;
          total_citations: number | null;
          expertise_tags: string[] | null;
          publications: Json[] | null;
          research_contributions: string[] | null;
          highlight: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Update: {
          id: string;
          name: string | null;
          profile_img: string | null;
          institution: string | null;
          total_citations: number | null;
          expertise_tags: string[] | null;
          publications: Json[] | null;
          research_contributions: string[] | null;
          highlight: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
      biomarkers: {
        Row: {
          id: string;
          name: string;
          alternative_names: string[] | null;
          description: string | null;
          category: string;
          normal_range: string | null;
          units: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          alternative_names?: string[] | null;
          description?: string | null;
          category: string;
          normal_range?: string | null;
          units?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          alternative_names?: string[] | null;
          description?: string | null;
          category?: string;
          normal_range?: string | null;
          units?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: []; // Add relationships here if you have any foreign keys
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_project_counts: {
        Args: { user_ids: string[] };
        Returns: {
          user_id: string;
          count: number;
        }[];
      };
    };
    Enums: {
      action_type:
        | "sign_up"
        | "login"
        | "password_change"
        | "project_create"
        | "project_update"
        | "project_delete"
        | "project_archive"
        | "project_unarchive"
        | "project_clone"
        | "profile_update"
        | "graph_create"
        | "graph_update"
        | "node_add"
        | "node_update"
        | "security_change";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      action_type: [
        "sign_up",
        "login",
        "password_change",
        "project_create",
        "project_update",
        "project_delete",
        "project_archive",
        "project_unarchive",
        "project_clone",
        "profile_update",
        "graph_create",
        "graph_update",
        "node_add",
        "node_update",
        "security_change",
      ],
    },
  },
} as const;
