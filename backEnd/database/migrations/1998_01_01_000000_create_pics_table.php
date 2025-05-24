<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePicsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pics', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('path');
            $table->enum('type_image', ['uploaded', 'ai_generated'])->default('uploaded');
            $table->string('mime_type')->nullable();
            $table->string('original_filename')->nullable();
            $table->integer('size')->nullable()->comment('File size in bytes');
            $table->integer('width')->nullable()->comment('Image width in pixels');
            $table->integer('height')->nullable()->comment('Image height in pixels');
            $table->string('alt_text')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        

        // Then drop the pics table
        Schema::dropIfExists('pics');
    }
}